import { ApiProperty } from '@nestjs/swagger';

export class FilterBooksDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  author: string;
  @ApiProperty()
  genre: string;
  @ApiProperty()
  language: string;
  @ApiProperty()
  condition: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  city: string;
}
