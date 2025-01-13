import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExchangeState } from 'src/exchanges/entities/exchange.entity';

export class UpdateExchangeDto {
  @ApiProperty({
    example: 456,
    description: 'The ID of the exchange to be updated',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'completed',
    description:
      'The new state of the exchange (e.g., available, completed, canceled)',
  })
  @IsNotEmpty()
  state: ExchangeState;
}
