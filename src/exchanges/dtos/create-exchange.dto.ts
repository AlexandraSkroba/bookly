import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExchangeDto {
  @ApiProperty({
    example: 123,
    description: 'The ID of the book involved in the exchange',
  })
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({
    example: 'Details about the exchange process or specific requirements',
    description: 'Additional details or notes about the exchange',
    required: false,
  })
  details: string;
}
