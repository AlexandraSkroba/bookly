import { IsStrongPassword } from '../validators/is-strong-password.validator';
import { Match } from '../validators/match.validator';

export class UpdatePasswordDto {
  @IsStrongPassword()
  newPassword: string;

  @Match('newPassword')
  newPasswordConfirmation: string;
}
