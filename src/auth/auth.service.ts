import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { USER_REPOSITORY } from "src/constants";
import { CreateUserInterface } from "src/user/interfaces/create-user.interface";
import { UserRepository } from "src/user/user.repository";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(@Inject(USER_REPOSITORY) private userRepository: UserRepository, private configService: ConfigService) { }
    async signUp(user: CreateUserInterface) {
        const existUser = await this.userRepository.findByEmail(user)
        if (existUser) throw new BadRequestException('This email already exist')


        const newUser: CreateUserInterface = {
            email: user.email,
            password: await argon2.hash(user.password)
        }

        await this.userRepository.createAndSave(newUser)
        return { message: "User registered successfully", newUser: newUser }
    }
}
