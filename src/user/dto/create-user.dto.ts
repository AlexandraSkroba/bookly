import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { IsStrongPassword } from '../validators/is-strong-password';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  username: string;
}
