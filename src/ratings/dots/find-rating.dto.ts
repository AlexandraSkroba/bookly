import { IsInt, IsNotEmpty } from 'class-validator';
import { RatingTarget } from '../entities/rating.entity';

export class FindRatingDTO {
  @IsInt()
  targetId: number;

  @IsNotEmpty()
  targetType: RatingTarget;
}
