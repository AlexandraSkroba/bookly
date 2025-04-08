import { Body, Controller, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AUTH_SERVICE } from "src/constants";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(@Inject(AUTH_SERVICE) private authService: AuthService) { }

    // auth/signup
    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto)
    }
}
