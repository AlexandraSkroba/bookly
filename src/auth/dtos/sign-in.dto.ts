import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The password of the user',
  })
  password: string;
}
