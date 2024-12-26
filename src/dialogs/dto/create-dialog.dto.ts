import { IsInt } from 'class-validator';

export class CreateDialogDto {
  @IsInt()
  userId: number;

  subjectId: number;
}
