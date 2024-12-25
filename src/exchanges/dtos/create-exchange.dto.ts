import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExchangeDto {
  @IsNotEmpty()
  @ApiProperty()
  bookId: number;
}
