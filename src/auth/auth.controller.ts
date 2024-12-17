import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/constants';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
}
