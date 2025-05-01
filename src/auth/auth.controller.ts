import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AUTH_SERVICE } from "src/constants";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./utils/guards";
import { Request } from "express";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
export class AuthController {
    constructor(@Inject(AUTH_SERVICE) private authService: AuthService) { }

    // login
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }

    // auth/signup
    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto)
    }

    // auth/google/login
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg: 'Google Authentication' };
    }

    // auth/google/redirect
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: 'OK' };
    }

    // auth/status
    @UseGuards(AuthGuard)
    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated' };
        } else {
            return { msg: 'Not Authenticated' };
        }
    }
}
