import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the user requesting password recovery',
  })
  email: string;
}
