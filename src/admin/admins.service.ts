import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SuspendUserDto } from './dtos/suspend-user.dto';
import { Complain } from 'src/complains/entities/complain.entity';
import { SatisfyComplaintDto } from './dtos/satisfy-complaint.dto';
import { UpdateExchangeDto } from './dtos/update-exchange.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(ExchangeEntity)
    private readonly exchangeRepository: Repository<ExchangeEntity>,
    @InjectRepository(Complain)
    private readonly complainsRepository: Repository<Complain>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async getBooks() {
    return await this.bookRepository.find();
  }

  async getExchanges() {
    return await this.exchangeRepository.find({
      relations: ['book', 'from', 'to'],
    });
  }

  async getComplains() {
    return await this.complainsRepository.find({ relations: ['rating'] });
  }

  async suspendUser(params: SuspendUserDto) {
    return await this.usersRepository.update(params.id, { isSuspended: false });
  }

  async satisfyComplaint(params: SatisfyComplaintDto) {
    return await this.complainsRepository.delete(params.id);
  }

  async updateExchange(params: UpdateExchangeDto) {
    return await this.exchangeRepository.update(params.id, params);
  }

  async deleteExchange(id: number) {
    return await this.exchangeRepository.delete(id);
  }
}
