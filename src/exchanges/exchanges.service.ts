import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeEntity, ExchangeState } from './entities/exchange.entity';
import { In, Repository } from 'typeorm';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity, BookExchangeState } from 'src/books/entities/book.entity';
import { BooksService } from 'src/books/books.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExchangeOfferedEvent } from 'src/notifications/events/exchange-offered.event';
import { UpdateStateDto } from './dtos/update-state.dto';
import { ExchangeUpdatedEvent } from 'src/notifications/events/exchange-updated.event';
import { MessagesService } from 'src/messages/messages.service';
import axios from 'axios';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(ExchangeEntity)
    private readonly exchangesRepository: Repository<ExchangeEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
    private readonly booksService: BooksService,
    private readonly dialogsService: DialogsService,
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(user: UserEntity) {
    return await this.exchangesRepository.find({
      where: [{ from: { id: user.id } }, { to: { id: user.id } }],
      relations: ['from', 'to', 'book'],
    });
  }

  async findOne(id: number, relations: string[] = ['from', 'to', 'book']) {
    const exchange = await this.exchangesRepository.findOne({
      where: { id },
      relations: relations,
    });
    if (!exchange) {
      throw new NotFoundException();
    }

    return exchange;
  }

  async create(params: CreateExchangeDto, currentUser: UserEntity) {
    const to = currentUser;
    const book = await this.booksRepository.findOne({
      where: { id: params.bookId, exchangeState: BookExchangeState.available },
      relations: ['owner'],
    });
    if (!book) {
      throw new NotFoundException('Record Not Found');
    }

    const from = await this.usersRepository.findOneBy({ id: book.owner.id });
    if (!from) {
      throw new NotFoundException('Record Not Found');
    }

    const existingExchange = await this.exchangesRepository.findOne({
      where: {
        state: In([ExchangeState.preparation, ExchangeState.approved]),
        book: { id: book.id },
        to: { id: to.id },
      },
    });
    if (existingExchange) {
      throw new ConflictException('Exchange already created');
    }
    const newExchange = this.exchangesRepository.create({ from, to, book });
    const result = await this.exchangesRepository.save(newExchange);

    this.booksRepository.update(book.id, {
      exchangeState: BookExchangeState.requested,
    });

    let existingDialog = await this.dialogsService.checkExisting(
      { userId: newExchange.from.id, subjectId: null },
      currentUser,
      false,
    );
    if (existingDialog) {
      this.exchangesRepository.update(newExchange.id, {
        dialog: existingDialog,
      });

      if (params.details) {
        this.messagesService.create(
          { dialogId: existingDialog.id, text: params.details },
          currentUser,
          existingDialog,
          false,
        );
      }
    } else {
      const newDialog = await this.dialogsService.create(
        { userId: newExchange.from.id, subjectId: newExchange.id },
        currentUser,
      );

      if (params.details) {
        this.messagesService.create(
          { dialogId: newDialog.id, text: params.details },
          currentUser,
          newDialog,
          false,
        );
      }
    }

    this.eventEmitter.emit(
      'exchange.offered',
      new ExchangeOfferedEvent(
        result.to.id,
        result.from.id,
        result.to.username,
        book.id,
        book.title,
        result.id,
      ),
    );
    return result;
  }

  async updateState(id: number, params: UpdateStateDto, user: UserEntity) {
    const state = params.state;
    let exchange: ExchangeEntity;

    if (state === ExchangeState.approved || state === ExchangeState.declined) {
      exchange = await this.exchangesRepository.findOne({
        where: { id, from: { id: user.id } },
        relations: ['book', 'from', 'to', 'dialog.subjects'],
      });

      if (!exchange) {
        throw new NotFoundException('Record Not Found');
      }

      let bookState: BookExchangeState;
      if (state === ExchangeState.approved) {
        bookState = BookExchangeState['in exchange'];
        this.createDelivery(exchange);
      } else {
        bookState = BookExchangeState['available'];
      }

      this.booksService.changeState(exchange.book.id, bookState);
      if (state === ExchangeState.declined) {
        this.dialogsService.removeSubject(exchange.dialog, exchange);
      }
    } else {
      exchange = await this.exchangesRepository.findOne({
        where: { id },
        relations: ['book', 'to', 'from', 'dialog.subjects'],
      });

      if (!exchange) {
        throw new NotFoundException('Record Not Found');
      }

      await this.completeExchange(exchange);
    }

    const userId =
      state === ExchangeState.approved || state === ExchangeState.declined
        ? exchange.to.id
        : exchange.from.id;
    this.eventEmitter.emit(
      'exchange.updated',
      new ExchangeUpdatedEvent(exchange.book.title, userId),
    );
    return await this.exchangesRepository.update(id, {
      state: ExchangeState[state],
    });
  }

  async completeExchange(exchange: ExchangeEntity) {
    this.booksService.changeOwner(exchange.book.id, exchange.to);
    if (exchange.dialog) {
      this.dialogsService.removeSubject(exchange.dialog, exchange);
    }
    this.deleteDelivery(exchange);
    return await this.booksService.changeState(
      exchange.book.id,
      BookExchangeState.exchanged,
    );
  }

  async createDelivery(exchange: ExchangeEntity) {
    const data = {
      bookId: exchange.book.id
    }
    await axios.post(process.env.DELIVERY_API, data);
  }

  async getDeliveryState(id: number) {
    const exchange = await this.exchangesRepository.findOne({ where: { id }, relations: ['book'] })

    const response = await axios.get(process.env.DELIVERY_API, { params: { bookId: exchange.book.id } });
    return response.data
  }

  async deleteDelivery(exchange: ExchangeEntity) {
    axios.delete(process.env.DELIVERY_API, { params: { bookId: exchange.book.id } });
  }

  async delete(id: number, to: UserEntity) {
    const exchange = await this.exchangesRepository.findOne({
      where: { id, to: { id: to.id } },
      relations: ['to'],
    });
    if (!exchange) {
      throw new NotFoundException();
    }

    return this.exchangesRepository.delete(exchange);
  }
}
