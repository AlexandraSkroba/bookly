import { IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from 'src/users/validators/is-strong-password.validator';
import { Match } from 'src/users/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'resetToken123',
    description: 'The token used for password reset',
  })
  resetPasswordToken: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'NewStrongPassword123!',
    description:
      'The new password for the user (must meet strength requirements)',
  })
  newPassword: string;

  @Match('newPassword')
  @ApiProperty({
    example: 'NewStrongPassword123!',
    description:
      'Confirmation of the new password (must match the new password)',
  })
  newPasswordConfirmation: string;
}
