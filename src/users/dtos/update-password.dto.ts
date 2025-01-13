import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/is-strong-password.validator';
import { Match } from '../validators/match.validator';

export class UpdatePasswordDto {
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
