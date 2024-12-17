import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { IsStrongPassword } from '../validators/is-strong-password';

export class CreateUserData {
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  username: string;
}
