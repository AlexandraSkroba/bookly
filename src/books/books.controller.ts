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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BookDto } from './dtos/book.dto';
import { BooksService } from './books.service';
import { Request } from 'express';
import { FilterBooksDto } from './dtos/filter-books.dto';
import { BookExchangeState } from './entities/book.entity';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of books with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number for pagination',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of books per page',
    example: '10',
  })
  @ApiResponse({
    status: 200,
    description: 'List of books with pagination',
  })
  async index(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.booksService.findAll(parseInt(page), parseInt(limit));
  }

  @Post('search')
  @ApiOperation({ summary: 'Search for books based on filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number for pagination',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of books per page',
    example: '10',
  })
  @ApiBody({
    type: FilterBooksDto,
    description: 'Filters for searching books',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of books',
  })
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
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({
    type: BookDto,
    description: 'Details of the book to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'Book successfully created',
  })
  async create(@Req() req: Request, @Body() bookParams: BookDto) {
    return await this.booksService.create(bookParams, req.currentUser);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update details of an existing book' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to update',
    example: 1,
  })
  @ApiBody({
    type: BookDto,
    description: 'Updated details of the book',
  })
  @ApiResponse({
    status: 200,
    description: 'Book successfully updated',
  })
  async update(
    @Req() req: Request,
    @Param('id') bookId: number,
    @Body() bookParams: BookDto,
  ) {
    return await this.booksService.update(bookId, bookParams, req.currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific book' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the specified book',
  })
  async show(@Req() req: Request, @Param('id') bookId: number) {
    const book = await this.booksService.findOne(bookId);
    return { book, isOwner: book.owner.id === req.currentUser.id };
  }

  @Get(':id/make-available')
  @ApiOperation({ summary: 'Change the state of a book to available' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to make available',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Book state successfully changed to available',
  })
  async makeAvailable(@Req() req: Request, @Param('id') bookId: number) {
    return await this.booksService.changeState(
      bookId,
      BookExchangeState.available,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific book' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the book to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Book successfully deleted',
  })
  async destroy(@Req() req: Request, @Param('id') bookId: number) {
    return await this.booksService.delete(bookId, req.currentUser);
  }
}
