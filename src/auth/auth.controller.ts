import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards, UsePipes, ValidationPipe, Query, Redirect } from "@nestjs/common";
import { AUTH_SERVICE } from "src/constants";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./utils/guards";
import { Request } from "express";
import { AuthGuard } from "./auth.guard";
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOAuth2 } from "@nestjs/swagger";

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
    constructor(@Inject(AUTH_SERVICE) private authService: AuthService) { }


    // auth/signin
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(@Body() userData: CreateUserDto) {
      return {
        access_token: await this.authService.signIn(userData)
      }
    }

    // auth/signup
    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return {
            access_token: await this.authService.signUp(createUserDto)
        }
    }


    @Get('confirm-email')
    @Redirect()
    async confirmEmail(@Query('token') token: string) {
        const payload = await this.authService.verifyEmailConfirmationToken(token);
        await this.authService.confirmEmail(payload.email);
        return { 
            url: `${process.env.FRONTEND_URL}/login`, 
            statusCode: 302,
            message: 'Email confirmed successfully' 
        };
    }

    // auth/google/login FIXME
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg: 'Google Authentication' };
    }

    // auth/google/redirect
    @Get('google/redirect')
    @ApiExcludeEndpoint(true) // Exclude from Swagger
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: 'OK' };
    }

    // auth/status
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOAuth2(['bookly:write'])
    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated', user: request.user };
        } else {
            return { msg: 'Not Authenticated' };
        }
    }
}
