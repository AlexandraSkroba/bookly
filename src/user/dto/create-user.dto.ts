import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  userName: string;
}
