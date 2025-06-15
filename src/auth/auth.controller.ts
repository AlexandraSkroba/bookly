import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Query,
    Redirect,
} from '@nestjs/common'
import { AUTH_SERVICE } from 'src/constants'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { RecoverPasswordDto } from './dto/recover-password.dto'
import { AuthService } from './auth.service'
import { GoogleAuthGuard } from './utils/guards'
import { Request } from 'express'
import { AuthGuard } from './auth.guard'
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOAuth2 } from '@nestjs/swagger'

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
    constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

    // auth/login
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() userData: CreateUserDto) {
        return {
            access_token: await this.authService.signIn(userData),
        }
    }

    // auth/signup
    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        // createUserDto.username =
        //     createUserDto.username || createUserDto.email.split('@')[0] // Set username to email prefix
        return {
            access_token: await this.authService.signUp(createUserDto),
        }
    }

    @Get('confirm-email')
    @Redirect()
    async confirmEmail(@Query('token') token: string) {
        const payload = (await this.authService.verifyEmailConfirmationToken(
            token,
        )) as { email: string }
        await this.authService.confirmEmail(payload.email)
        return {
            url: `${process.env.FRONTEND_URL}/login`,
            statusCode: 302,
            message: 'Email confirmed successfully',
        }
    }

    @Post('recover-password')
    async recoverPassword(@Body() body: RecoverPasswordDto) {
        const { email } = body
        await this.authService.generatePasswordRecoveryToken(email)
        return { message: 'Password recovery email sent' }
    }

    @Post('reset-password')
    async resetPassword(
        @Body('token') token: string,
        @Body('newPassword') newPassword: CreateUserDto['password'],
    ) {
        await this.authService.resetPassword(token, newPassword)
        return { message: 'Password reset successfully' }
    }

    // auth/google/login FIXME
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg: 'Google Authentication' }
    }

    // auth/google/redirect
    @Get('google/redirect')
    @ApiExcludeEndpoint(true) // Exclude from Swagger
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: 'OK' }
    }

    // auth/status
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOAuth2(['bookly:write'])
    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user)
        if (request.user) {
            return { msg: 'Authenticated', user: request.user }
        } else {
            return { msg: 'Not Authenticated' }
        }
    }
}
