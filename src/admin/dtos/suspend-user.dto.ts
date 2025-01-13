import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuspendUserDto {
  @ApiProperty({
    example: 123,
    description: 'The ID of the user to be suspended',
  })
  @IsInt()
  id: number;
}
