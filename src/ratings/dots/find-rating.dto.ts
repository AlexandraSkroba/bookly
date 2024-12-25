import { IsInt, IsNotEmpty } from 'class-validator';
import { RatingTarget } from '../entities/rating.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindRatingDTO {
  @IsInt()
  @ApiProperty()
  targetId: number;

  @IsNotEmpty()
  @ApiProperty()
  targetType: RatingTarget;
}
