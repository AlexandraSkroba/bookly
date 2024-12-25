import { IsNotEmpty } from 'class-validator';
import { BookCondition } from '../entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  author: string;

  @IsNotEmpty()
  @ApiProperty()
  genre: string;

  @IsNotEmpty()
  @ApiProperty()
  language: string;

  @IsNotEmpty()
  @ApiProperty()
  condition: BookCondition;

  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;
}
