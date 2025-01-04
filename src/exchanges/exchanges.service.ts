import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeEntity, ExchangeState } from './entities/exchange.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity, BookExchangeState } from 'src/books/entities/book.entity';
import { BooksService } from 'src/books/books.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExchangeOfferedEvent } from 'src/notifications/events/exchange-offered.event';
import { UpdateStateDto } from './dtos/update-state.dto';

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
      throw new NotFoundException();
    }

    const from = await this.usersRepository.findOneBy({ id: book.owner.id });
    if (!from) {
      throw new NotFoundException();
    }

    const existingExchange = await this.exchangesRepository.findOne({
      where: { book: { id: book.id }, to: { id: to.id } },
      relations: ['book', 'to'],
    });
    if (existingExchange) {
      throw new ConflictException('Exchange already created');
    }
    const newExchange = this.exchangesRepository.create({ from, to, book });
    const result = await this.exchangesRepository.save(newExchange);

    this.booksRepository.update(book.id, {
      exchangeState: BookExchangeState.requested,
    });

    const existingDialog = await this.dialogsService.checkExisting(
      { userId: newExchange.from.id, subjectId: null },
      currentUser,
      false,
    );
    if (existingDialog) {
      this.exchangesRepository.update(newExchange.id, {
        dialog: existingDialog,
      });
    } else {
      this.dialogsService.create(
        { userId: newExchange.from.id, subjectId: newExchange.id },
        currentUser,
      );
    }

    this.eventEmitter.emit(
      'exchange.offered',
      new ExchangeOfferedEvent(
        result.from.id,
        result.from.username,
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
        relations: ['book', 'from'],
      });

      if (!exchange) {
        throw new NotFoundException('Record not found');
      }

      let bookState: BookExchangeState;
      if (state === ExchangeState.approved) {
        bookState = BookExchangeState['in exchange'];
      } else {
        bookState = BookExchangeState['available'];
      }

      this.booksService.changeState(exchange.book.id, bookState);
    } else {
      exchange = await this.exchangesRepository.findOne({
        where: { id },
        relations: ['book', 'to'],
      });

      if (!exchange) {
        throw new NotFoundException();
      }

      await this.completeExchange(exchange.book.id);
    }

    return await this.exchangesRepository.update(id, {
      state: ExchangeState[state],
    });
  }

  async completeExchange(id: number) {
    const exchange = await this.exchangesRepository.findOne({
      where: { id },
      relations: ['book', 'from', 'to'],
    });
    if (!exchange) {
      throw new NotFoundException('Record not found');
    }

    this.booksService.changeOwner(exchange.book.id, exchange.to);
    return await this.booksService.changeState(
      exchange.book.id,
      BookExchangeState.exchanged,
    );
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
