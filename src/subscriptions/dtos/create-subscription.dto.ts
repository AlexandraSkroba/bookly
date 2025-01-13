import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user who is subscribing',
  })
  userId: number;
}
