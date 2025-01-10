import { IsInt } from '@nestjs/class-validator';

export class SatisfyComplaintDto {
  @IsInt()
  id: number;
}
