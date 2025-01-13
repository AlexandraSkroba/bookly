import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the dialog where the message will be sent',
  })
  @IsInt()
  dialogId: number;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The content of the message. It must not be empty.',
  })
  @IsNotEmpty()
  text: string;
}
