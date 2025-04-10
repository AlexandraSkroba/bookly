import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/constants";
import { CreateGoogleUserInterface, CreateUserInterface } from "src/user/interfaces/create-user.interface";
import { UserRepository } from "src/user/user.repository";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(@Inject(USER_REPOSITORY) private userRepository: UserRepository) { }
    async signUp(user: CreateUserInterface) {
        const existUser = await this.userRepository.findByEmail(user.email)
        if (existUser) throw new BadRequestException('This email already exist')


        const newUser: CreateUserInterface = {
            email: user.email,
            password: await argon2.hash(user.password)
        }

        await this.userRepository.createAndSave(newUser)
        return { message: "User registered successfully", newUser: newUser }
    }

    async validateUser(user: CreateGoogleUserInterface) {
        const existUser = await this.userRepository.findByEmail(user.email)
        if (existUser) throw new BadRequestException('This email already exist')

        if (existUser) {
            return user
        }
        const newUser = await this.userRepository.createAndSave(user)
        return newUser
    }

    async findUser(id: number) {
        const user = await this.userRepository.findById(id)
        return user
    }
}
