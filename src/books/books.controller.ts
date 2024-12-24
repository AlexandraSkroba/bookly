import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BookDto } from './dtos/book.dto';
import { BooksService } from './books.service';
import { Request } from 'express';
import { FilterBooksDto } from './dtos/filter-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async index(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.booksService.findAll(parseInt(page), parseInt(limit));
  }

  @Post('search')
  async search(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Body() filterParams: FilterBooksDto,
  ) {
    return await this.booksService.search(
      filterParams,
      parseInt(page),
      parseInt(limit),
    );
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
  async show(@Req() req: Request, @Param('id') bookId: number) {
    const book = await this.booksService.findOne(bookId);
    return { book, isOwner: book.owner.id === req.currentUser.id }
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') bookId: number) {
    return await this.booksService.delete(bookId, req.currentUser);
  }
}
