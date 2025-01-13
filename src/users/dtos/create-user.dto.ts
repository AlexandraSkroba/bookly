import { IsEmail } from '@nestjs/class-validator';
import { IsStrongPassword } from '../validators/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  username: string;

  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user (must meet strength requirements)',
  })
  password: string;
}
