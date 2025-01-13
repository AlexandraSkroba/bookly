import { ApiProperty } from '@nestjs/swagger';

export class FilterBooksDto {
  @ApiProperty({
    example: 'To Kill a Mockingbird',
    description: 'The title of the book to filter by',
    required: false,
  })
  title: string;

  @ApiProperty({
    example: 'Harper Lee',
    description: 'The author of the book to filter by',
    required: false,
  })
  author: string;

  @ApiProperty({
    example: 'Fiction',
    description: 'The genre of the book to filter by',
    required: false,
  })
  genre: string;

  @ApiProperty({
    example: 'English',
    description: 'The language of the book to filter by',
    required: false,
  })
  language: string;

  @ApiProperty({
    example: 'Good',
    description: 'The condition of the book to filter by',
    required: false,
  })
  condition: string;

  @ApiProperty({
    example: 'United States',
    description: 'The country where the book is available',
    required: false,
  })
  country: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city where the book is located',
    required: false,
  })
  city: string;
}
