import { ApiProperty } from '@nestjs/swagger';

export class UpdateRatingDTO {
  @ApiProperty({
    example: 'Updated feedback text',
    description: 'The updated text of the rating',
    required: false,
  })
  text: string;

  @ApiProperty({
    example: 5,
    description: 'The updated rating score (1-5)',
    required: false,
  })
  rate: number;
}
