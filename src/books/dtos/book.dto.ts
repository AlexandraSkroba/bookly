import { IsNotEmpty } from 'class-validator';
import { BookCondition } from '../entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'To Kill a Mockingbird',
    description: 'The title of the book',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Harper Lee',
    description: 'The author of the book',
  })
  author: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Fiction',
    description: 'The genre of the book',
  })
  genre: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'English',
    description: 'The language in which the book is written',
  })
  language: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Good',
    description: 'The condition of the book (e.g., new, good, used)',
    enum: BookCondition,
  })
  condition: BookCondition;

  @IsNotEmpty()
  @ApiProperty({
    example: 'United States',
    description: 'The country where the book is available',
  })
  country: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'New York',
    description: 'The city where the book is located',
  })
  city: string;
}
