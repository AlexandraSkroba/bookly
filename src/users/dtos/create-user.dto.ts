import { IsEmail } from '@nestjs/class-validator';
import { IsStrongPassword } from '../validators/is-strong-password.validator';

export class CreateUserDto {
  username: string;

  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsStrongPassword()
  password: string;
}
