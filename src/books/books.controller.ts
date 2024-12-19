import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { BookDto } from './dtos/book.dto';
import { BooksService } from './books.service';
import { Request } from 'express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async index() {
    return await this.booksService.findAll();
  }

  @Post()
  async create(@Req() req: Request, @Body() bookParams: BookDto) {
    return await this.booksService.create(bookParams, req.currentUser);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') bookId: number,
    @Body() bookParams: BookDto,
  ) {
    return await this.booksService.update(bookId, bookParams, req.currentUser);
  }

  @Get(':id')
  async show(@Param('id') bookId: number) {
    return await this.booksService.findOne(bookId);
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') bookId: number) {
    return await this.booksService.delete(bookId, req.currentUser);
  }
}
