import { IsNotEmpty } from '@nestjs/class-validator';

export class CreateExchangeDto {
  @IsNotEmpty()
  bookId: number;
}
