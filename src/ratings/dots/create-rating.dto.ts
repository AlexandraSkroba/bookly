import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { RatingTarget } from '../entities/rating.entity';

export class CreateRatingDTO {
  text: string;

  @IsInt({ message: 'Rate must be an integer' })
  @Min(1, { message: 'Rate must be from 1 to 5' })
  @Max(5, { message: 'Rate must be from 1 to 5' })
  rate: number;

  @IsNotEmpty()
  targetType: RatingTarget;

  @IsInt({ message: "Selected target doesn't exist" })
  targetId: number;
}
