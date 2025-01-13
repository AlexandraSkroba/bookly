import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { SuspendUserDto } from './dtos/suspend-user.dto';
import { Complain } from 'src/complains/entities/complain.entity';
import { SatisfyComplaintDto } from './dtos/satisfy-complaint.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminsController {
  constructor(@Inject() private readonly adminsService: AdminsService) {}

  @Get('users')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserEntity],
  })
  async getUsers(): Promise<Array<UserEntity>> {
    return await this.adminsService.getUsers();
  }

  @Get('books')
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({
    status: 200,
    description: 'List of all books',
    type: [BookEntity],
  })
  async getBooks(): Promise<Array<BookEntity>> {
    return await this.adminsService.getBooks();
  }

  @Get('exchanges')
  @ApiOperation({ summary: 'Retrieve all exchanges' })
  @ApiResponse({
    status: 200,
    description: 'List of all exchanges',
    type: [ExchangeEntity],
  })
  async getExchanges(): Promise<Array<ExchangeEntity>> {
    return await this.adminsService.getExchanges();
  }

  @Get('complaints')
  @ApiOperation({ summary: 'Retrieve all complaints' })
  @ApiResponse({
    status: 200,
    description: 'List of all complaints',
    type: [Complain],
  })
  async getComplaints(): Promise<Array<Complain>> {
    return await this.adminsService.getComplaints();
  }

  @Post('suspend-user')
  @ApiOperation({ summary: 'Suspend a user' })
  @ApiBody({
    type: SuspendUserDto,
    description: 'Details of the user to suspend',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully suspended',
  })
  async suspendUser(@Body() params: SuspendUserDto) {
    return await this.adminsService.suspendUser(params);
  }

  @Post('unsuspend-user')
  @ApiOperation({ summary: 'Unsuspend a user' })
  @ApiBody({
    type: SuspendUserDto,
    description: 'Details of the user to unsuspend',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully unsuspended',
  })
  async unsuspendUser(@Body() params: SuspendUserDto) {
    return await this.adminsService.unsuspendUser(params);
  }

  @Delete('exchange/:id')
  @ApiOperation({ summary: 'Delete an exchange' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the exchange to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Exchange successfully deleted',
  })
  async destroyExchange(@Param('id') id: number) {
    return await this.adminsService.deleteExchange(id);
  }

  @Delete('book/:id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the book to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Book successfully deleted',
  })
  async destroyBook(@Param('id') id: number) {
    return await this.adminsService.deleteBook(id);
  }

  @Post('complaints/satisfy')
  @ApiOperation({ summary: 'Satisfy a complaint' })
  @ApiBody({
    type: SatisfyComplaintDto,
    description: 'Details of the complaint to satisfy',
  })
  @ApiResponse({
    status: 200,
    description: 'Complaint successfully satisfied',
  })
  async satisfyComplaint(@Body() params: SatisfyComplaintDto) {
    return await this.adminsService.satisfyComplaint(params);
  }
}
