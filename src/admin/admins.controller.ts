import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { SuspendUserDto } from './dtos/suspend-user.dto';
import { Complain } from 'src/complains/entities/complain.entity';
import { SatisfyComplaintDto } from './dtos/satisfy-complaint.dto';

@Controller('admin')
export class AdminsController {
  constructor(@Inject() private readonly adminsService: AdminsService) {}

  @Get('users')
  async getUsers(): Promise<Array<UserEntity>> {
    return await this.adminsService.getUsers();
  }

  @Get('books')
  async getBooks(): Promise<Array<BookEntity>> {
    return await this.adminsService.getBooks();
  }

  @Get('exchanges')
  async getExchanges(): Promise<Array<ExchangeEntity>> {
    return await this.adminsService.getExchanges();
  }

  @Get('complaints')
  async getComplaints(): Promise<Array<Complain>> {
    return await this.adminsService.getComplaints();
  }

  @Post('suspend-user')
  async suspendUser(@Body() params: SuspendUserDto) {
    return await this.adminsService.suspendUser(params);
  }

  @Post('unsuspend-user')
  async unsuspendUser(@Body() params: SuspendUserDto) {
    return await this.adminsService.unsuspendUser(params);
  }

  @Delete('exchange/:id')
  async destroyExchange(@Param('id') id: number) {
    return await this.adminsService.deleteExchange(id);
  }

  @Delete('book/:id')
  async destroyBook(@Param('id') id: number) {
    return await this.adminsService.deleteBook(id);
  }

  @Post('complaints/satisfy')
  async satisfyComplaint(@Body() params: SatisfyComplaintDto) {
    return await this.adminsService.satisfyComplaint(params);
  }
}
