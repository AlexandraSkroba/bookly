import { IsNotEmpty } from 'class-validator';
import { BookCondition } from '../entities/book.entity';

export class BookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  condition: BookCondition;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;
}
