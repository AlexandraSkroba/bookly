import { IsInt, IsNotEmpty } from 'class-validator';
import { ExchangeState } from 'src/exchanges/entities/exchange.entity';

export class UpdateExchangeDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  state: ExchangeState;
}
