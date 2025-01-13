import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { RatingTarget } from '../entities/rating.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDTO {
  @ApiProperty({
    example: 'Great service!',
    description: 'The text of the rating or feedback',
    required: false,
  })
  text: string;

  @IsInt({ message: 'Rate must be an integer' })
  @Min(1, { message: 'Rate must be from 1 to 5' })
  @Max(5, { message: 'Rate must be from 1 to 5' })
  @ApiProperty({
    example: 4,
    description: 'The rating score (1-5)',
  })
  rate: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'product',
    description: 'The type of the target being rated (e.g., product, service)',
    enum: RatingTarget,
  })
  targetType: RatingTarget;

  @IsInt({ message: "Selected target doesn't exist" })
  @ApiProperty({
    example: 123,
    description: 'The ID of the target being rated',
  })
  targetId: number;
}
