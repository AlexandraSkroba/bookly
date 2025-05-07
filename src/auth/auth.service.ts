import { BadRequestException, Dependencies, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { USER_REPOSITORY } from "src/constants";
import { CreateGoogleUserInterface, CreateUserInterface } from "src/user/interfaces/create-user.interface";
import { UserRepository } from "src/user/user.repository";
import * as argon2 from "argon2";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY) 
        private userRepository: UserRepository, 
        private userService: UserService, 
        private jwtService: JwtService
    ) {}
    async signIn(userData: CreateUserDto): Promise<string> {
        const { email, password: pass } = userData;

        const user = await this.userService.findOne(email);
        if (!user?.password) throw new BadRequestException('User not found')
        if (!(await argon2.verify(user.password, pass))) throw new UnauthorizedException('Wrong password');
        
        const payload = { email: user.email, sub: user.id };
        
        return this.jwtService.signAsync(payload)
    }

    async signUp(userData: CreateUserInterface): Promise<string> {
        const existUser = await this.userRepository.findByEmail(userData.email)
        if (existUser) throw new BadRequestException('This email already exist')


        const newUser: CreateUserInterface = {
            email: userData.email,
            password: await argon2.hash(userData.password)
        }
        const user = await this.userRepository.createAndSave(newUser)

        const payload = { email: user.email, sub: user.id }

        return this.jwtService.signAsync(payload)
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
