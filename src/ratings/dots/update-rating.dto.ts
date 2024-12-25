import { ApiProperty } from "@nestjs/swagger";

export class UpdateRatingDTO {
  @ApiProperty()
  text: string;
  @ApiProperty()
  rate: number;
}
