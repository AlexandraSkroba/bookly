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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { NewPasswordDto } from './dtos/new-password.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({
    type: SignInDto,
    description: 'Credentials for user sign-in',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
  })
  async signIn(@Body() credentials: SignInDto) {
    return await this.authService.authorizeUser(credentials);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Details for creating a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: 'Confirm user email' })
  @ApiParam({
    name: 'token',
    type: String,
    description: 'Confirmation token for verifying the user email',
    example: 'abc123token',
  })
  @ApiResponse({
    status: 200,
    description: 'Email successfully confirmed',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not provided or invalid',
  })
  async confirmEmail(@Param('token') token: string) {
    if (!token) {
      throw new NotFoundException('No token provided');
    }
    return this.authService.confirmUser(token);
  }

  @Get('reset-password')
  @ApiOperation({ summary: 'Reset password using a token' })
  @ApiQuery({
    name: 'token',
    type: String,
    description: 'Reset password token',
    example: 'resetToken123',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset initiated',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not provided or invalid',
  })
  async passwordRecovery(@Query('token') token: string) {
    if (!token) {
      throw new NotFoundException('No token provided');
    }
    return await this.authService.resetPassword(token);
  }

  @Post('new-password')
  @ApiOperation({ summary: 'Set a new password' })
  @ApiBody({
    type: NewPasswordDto,
    description: 'Details for setting a new password',
  })
  @ApiResponse({
    status: 200,
    description: 'New password successfully set',
  })
  async setNewPassword(@Body() resetPasswordParams: NewPasswordDto) {
    return await this.authService.setNewPassword(resetPasswordParams);
  }

  @Post('recover-password')
  @ApiOperation({ summary: 'Request a password recovery email' })
  @ApiBody({
    type: RecoverPasswordDto,
    description: 'Email address for initiating password recovery',
  })
  @ApiResponse({
    status: 200,
    description: 'Password recovery email successfully sent',
  })
  async recoverPassword(@Body() recoverParams: RecoverPasswordDto) {
    return await this.authService.recoverPassword(recoverParams);
  }
}
