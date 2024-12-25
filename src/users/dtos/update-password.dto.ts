import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/is-strong-password.validator';
import { Match } from '../validators/match.validator';

export class UpdatePasswordDto {
  @IsStrongPassword()
  @ApiProperty()
  newPassword: string;

  @Match('newPassword')
  @ApiProperty()
  newPasswordConfirmation: string;
}
