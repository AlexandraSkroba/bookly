import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStateDto {
  @ApiProperty({
    example: 'completed',
    description:
      'The new state of the exchange (e.g., pending, completed, canceled)',
  })
  @IsNotEmpty()
  state: string;
}
