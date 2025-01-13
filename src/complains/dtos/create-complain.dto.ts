import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplainDto {
  @ApiProperty({
    example: 123,
    description: 'The ID of the rating being complained about',
  })
  @IsNotEmpty()
  ratingId: number;
}
