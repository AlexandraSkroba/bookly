import { IsNotEmpty } from "@nestjs/class-validator";


export class CreateComplainDto {
  @IsNotEmpty()
  ratingId: number;
}
