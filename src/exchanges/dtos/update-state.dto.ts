import { IsNotEmpty } from '@nestjs/class-validator';

export class UpdateStateDto {
  @IsNotEmpty()
  state: string;
}
