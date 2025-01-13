import { IsInt } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SatisfyComplaintDto {
  @ApiProperty({
    example: 123,
    description: 'The ID of the complaint to be satisfied',
  })
  @IsInt()
  id: number;
}
