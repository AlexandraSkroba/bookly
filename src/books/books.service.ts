import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { EntityManager, Filter, Repository } from 'typeorm';
import { BookDto } from './dtos/book.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { FilterBooksDto } from './dtos/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
    private entityManager: EntityManager,
  ) {}

  async findOne(bookId: number) {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
      relations: ['user'],
    });
    if (!book) {
      throw new NotFoundException();
    }
    return book;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ books: BookEntity[]; total: number }> {
    const books = await this.booksRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });
    const total = books.length;
    return { books, total };
  }

  async search(filters: FilterBooksDto, page: number, limit: number) {
    const rawBooks = await this.entityManager.query(this.formSQL(filters));
    console.log(rawBooks);
    return rawBooks.map((rawBook) => {
      const book = new BookEntity();
      Object.assign(book, rawBook);

      return book;
    });
  }

  async create(bookParams: BookDto, currentUser: UserEntity) {
    const newBook = this.booksRepository.create({
      user: currentUser,
      ...bookParams,
    });

    return await this.booksRepository.save(newBook);
  }

  async update(bookId: number, bookParams: BookDto, user: UserEntity) {
    const book = await this.booksRepository.findOne({
      where: { id: bookId, user: { id: user.id } },
    });
    if (!book) {
      throw new NotFoundException();
    }

    const result = await this.booksRepository.update(book.id, {
      ...bookParams,
    });
    if (result.affected !== 1) {
      throw new ConflictException('Something gone wrong. Please try again');
    }
    return { message: 'Updated successfully' };
  }

  async delete(bookId: number, user: UserEntity) {
    const book = await this.findOne(bookId);
    if (book.user.id !== user.id) {
      throw new ForbiddenException();
    }

    this.booksRepository.delete({ id: bookId, user: { id: user.id } });
  }

  private formSQL(filters: FilterBooksDto) {
    const select = 'SELECT * FROM books WHERE ';
    const keys = Object.keys(filters);

    let sql = [];
    keys.map((key, _i) => {
      if (filters[key]) {
        sql.push(`${key} LIKE '%${filters[key]}%'`);
      }
    });
    return select + sql.join(' AND ');
  }
}
