import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeEntity, ExchangeState } from './entities/exchange.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity, BookExchangeState } from 'src/books/entities/book.entity';
import { BooksService } from 'src/books/books.service';

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
  ) {}

  async findAll(user: UserEntity) {
    return await this.exchangesRepository.find({
      where: [{ from: { id: user.id } }, { to: { id: user.id } }],
      relations: ['from', 'to'],
    });
  }

  async findOne(id: number) {
    const exchange = await this.exchangesRepository.findOne({
      where: { id },
      relations: ['from', 'to', 'book'],
    });
    if (!exchange) {
      throw new NotFoundException();
    }

    return exchange;
  }

  async create(params: CreateExchangeDto, currentUser: UserEntity) {
    const to = currentUser;
    const book = await this.booksRepository.findOne({
      where: { id: params.bookId },
      relations: ['owner'],
    });
    if (!book) {
      throw new NotFoundException();
    }

    const from = await this.usersRepository.findOneBy({ id: book.owner.id });
    if (!from) {
      throw new NotFoundException();
    }

    const newExchange = this.exchangesRepository.create({ from, to, book });
    return await this.exchangesRepository.save(newExchange);
  }

  async updateState(id: number, state: string, user: UserEntity) {
    let exchange: ExchangeEntity;
    switch (state) {
      case ExchangeState.preparation: {
        exchange = await this.exchangesRepository.findOne({
          where: [
            { id, to: { id: user.id } },
            { id, from: { id: user.id } },
          ],
          relations: ['from', 'to'],
        });

        this.booksService.changeState(
          exchange.book.id,
          BookExchangeState.requested,
        );
        break;
      }
      case ExchangeState.approved || ExchangeState.declined: {
        exchange = await this.exchangesRepository.findOne({
          where: { id, from: { id: user.id } },
          relations: ['from'],
        });

        if (!exchange) {
          throw new NotFoundException();
        }

        // if we're approving the exchange, book state will change to "in exchange"
        // if we're declining the exchange and there is no other exchanges requested for this book, then book becomes "available", otherwise "requested"
        let bookState: BookExchangeState;
        if (state === ExchangeState.approved) {
          bookState = BookExchangeState['in exchange'];
        } else {
          if (
            (
              await this.exchangesRepository.find({
                where: { book: { id: exchange.book.id } },
                relations: ['book'],
              })
            ).length > 1
          ) {
            bookState = BookExchangeState['requested'];
          } else {
            bookState = BookExchangeState['available'];
          }
        }

        this.booksService.changeState(exchange.book.id, bookState);
        break;
      }
      case ExchangeState.completed: {
        exchange = await this.exchangesRepository.findOne({
          where: { id, to: { id: user.id } },
          relations: ['book', 'to'],
        });

        if (!exchange) {
          throw new NotFoundException();
        }

        await this.completeExchange(exchange.book.id, exchange.to);
        break;
      }
    }

    return await this.exchangesRepository.update(id, {
      state: ExchangeState[state],
    });
  }

  async completeExchange(id: number, user: UserEntity) {
    const exchange = await this.exchangesRepository.findOne({
      where: { id, to: { id: user.id } },
      relations: ['book', 'from', 'to'],
    });
    if (!exchange) {
      throw new NotFoundException();
    }

    await this.booksService.changeOwner(exchange.book.id, exchange.to);
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
