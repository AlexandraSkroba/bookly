import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { NewPasswordDto } from './dtos/new-password.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('/')
  async signIn(@Body() credentials: SignInDto) {
    const token = this.authService.authorizeUser(credentials);
    return token;
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    if (!token) {
      throw new NotFoundException('No token provided');
    }

    return this.authService.confirmUser(token);
  }

  @Get('reset-password')
  async passwordRecovery(@Query('token') token: string) {
    if (!token) {
      throw new NotFoundException('No token provided');
    }

    return await this.authService.resetPassword(token);
  }

  @Post('new-password')
  async setNewPassword(@Body() resetPasswordParams: NewPasswordDto) {
    return await this.authService.setNewPassword(resetPasswordParams);
  }

  @Post('recover-password')
  async recoverPassword(@Body() recoverParams: RecoverPasswordDto) {
    return await this.authService.recoverPassword(recoverParams);
  }
}
