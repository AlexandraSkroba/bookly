import { IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from 'src/users/validators/is-strong-password.validator';
import { Match } from 'src/users/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';


export class NewPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  resetPasswordToken: string;

  @IsStrongPassword()
  @ApiProperty()
  newPassword: string;

  @Match('newPassword')
  @ApiProperty()
  newPasswordConfirmation: string;
}
