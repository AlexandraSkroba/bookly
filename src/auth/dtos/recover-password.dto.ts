import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
