import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { SuspendUserDto } from './dtos/suspend-user.dto';
import { UpdateExchangeDto } from './dtos/update-exchange.dto';

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

  @Post('suspend-user')
  async suspendUser(@Body() params: SuspendUserDto) {
    return await this.adminsService.suspendUser(params);
  }

  @Patch('update-exchange')
  async updateExchange(@Body() params: UpdateExchangeDto) {
    return await this.adminsService.updateExchange(params);
  }

  @Delete('exchange/:id')
  async destroyExchange(@Param('id') id: number) {
    return await this.adminsService.deleteExchange(id);
  }
}
