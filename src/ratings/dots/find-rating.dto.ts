import { IsInt, IsNotEmpty } from 'class-validator';
import { RatingTarget } from '../entities/rating.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindRatingDTO {
  @IsInt()
  @ApiProperty({
    example: 123,
    description: 'The ID of the target being queried for ratings',
  })
  targetId: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'product',
    description: 'The type of the target being queried for ratings',
    enum: RatingTarget,
  })
  targetType: RatingTarget;
}
