import { IsEmail } from '@nestjs/class-validator';
import { IsStrongPassword } from '../validators/is-strong-password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  username: string;

  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
