import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty()
  password: string;
}
