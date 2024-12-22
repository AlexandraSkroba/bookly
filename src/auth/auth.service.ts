import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordDto } from './dtos/new-password.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private jwtService: JwtService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const newUser = await this.UsersService.create(createUserDto);

    const confirmationUrl =
      process.env.FRONTEND_URL +
      '/auth/confirm/?token=' +
      newUser.confirmationToken;
    const data = {
      to: newUser.email,
      subject: 'Confirm your email',
      context: { confirmationUrl },
    };

    await this.emailQueue.add('confirmation', data, { delay: 0 });
    return {
      message: 'You signed up successfully! Now please confirm your email',
    };
  }

  async confirmUser(token: string): Promise<{ message: string }> {
    await this.UsersService.confirmUser(token);

    return {
      message:
        'Your account has been successfully confirmed. Please log in using your credentials',
    };
  }

  async authorizeUser(
    credentials: SignInDto,
  ): Promise<{ access_token: string }> {
    const user = await this.UsersService.authenticate(credentials);
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async resetPassword(token: string) {
    return await this.UsersService.resetPassword(token);
  }

  async setNewPassword(newPasswordParams: NewPasswordDto) {
    return await this.UsersService.setNewPassword(newPasswordParams);
  }

  async recoverPassword(recoverParams: RecoverPasswordDto) {
    const user = await this.UsersService.findOne({
      where: { email: recoverParams.email, isConfirmed: true },
    });
    await user.generateResetPasswordToken();
    await this.UsersService.update(user.id, {
      resetPasswordToken: user.resetPasswordToken,
    });

    const resetPasswordUrl =
      process.env.FRONTEND_URL +
      '/password-reset/?token=' +
      user.resetPasswordToken;
    const data = {
      to: user.email,
      subject: 'Reset password',
      context: { resetPasswordUrl },
    };

    return await this.emailQueue.add('reset-password', data, { delay: 0 });
  }
}
