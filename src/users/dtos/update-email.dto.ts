import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
