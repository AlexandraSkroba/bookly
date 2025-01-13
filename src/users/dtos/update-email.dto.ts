import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'The new email address for the user',
  })
  email: string;
}
