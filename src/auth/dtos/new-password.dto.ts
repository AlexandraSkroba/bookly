import { IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from 'src/users/validators/is-strong-password.validator';
import { Match } from 'src/users/validators/match.validator';

export class NewPasswordDto {
  @IsNotEmpty()
  resetPasswordToken: string;

  @IsStrongPassword()
  newPassword: string;

  @Match('newPassword')
  newPasswordConfirmation: string;
}
