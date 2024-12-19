import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookDto } from './dtos/book.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
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

  async findAll() {
    return await this.booksRepository.find({ relations: ['user'] });
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
}
