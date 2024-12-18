import {
  Get,
  Inject,
  Param,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

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

  @Post('signin')
  async signIn(@Body() credentials: SignInDto) {
    const token = this.authService.authorizeUser(credentials);
    return token;
  }
}
