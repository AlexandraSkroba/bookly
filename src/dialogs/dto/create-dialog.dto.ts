import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty({
    example: 123,
    description: 'The ID of the user to create a dialog with',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 456,
    description: 'The ID of the subject associated with the dialog',
    required: false,
  })
  subjectId: number;
}
