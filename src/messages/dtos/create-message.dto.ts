import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  dialogId: number;

  @IsNotEmpty()
  text: string;
}
