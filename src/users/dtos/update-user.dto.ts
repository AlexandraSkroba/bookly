import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'johnsmith',
    description: 'The updated username for the user',
  })
  username: string;
}
