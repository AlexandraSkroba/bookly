import { Get, Inject, Param, NotFoundException } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    if (token) {
      return this.authService.confirmUser(token)
    } else {
      throw new NotFoundException('No token provided')
    }
  }
}
