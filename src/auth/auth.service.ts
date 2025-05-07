import { BadRequestException, Dependencies, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { USER_REPOSITORY } from "src/constants";
import { CreateGoogleUserInterface, CreateUserInterface } from "src/user/interfaces/create-user.interface";
import { UserRepository } from "src/user/user.repository";
import * as argon2 from "argon2";
import { UserService } from "../user/user.service";
import { MailerService } from "src/mailer/mailer.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY) 
        private userRepository: UserRepository, 
        private userService: UserService, 
        private jwtService: JwtService,
        private mailerService: MailerService
    ) {}
    async signIn(userData: CreateUserDto): Promise<string> {
        const { email, password: pass } = userData;

        const user = await this.userService.findOne(email);
        if (!user?.password) throw new BadRequestException('User not found')
        if (!user.isEmailConfirmed) throw new UnauthorizedException('Email not confirmed');
        if (!(await argon2.verify(user.password, pass))) throw new UnauthorizedException('Wrong password');
        
        const payload = { email: user.email, sub: user.id };
        
        return this.jwtService.signAsync(payload)
    }

    async signUp(userData: CreateUserDto): Promise<string> {
        const existUser = await this.userRepository.findByEmail(userData.email);
        if (existUser) throw new BadRequestException('This email already exists');
    
        const newUser = await this.userRepository.createAndSave({
            email: userData.email,
            password: await argon2.hash(userData.password),
        });
    
        const token = await this.generateEmailConfirmationToken(newUser.email);
        const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    
        await this.mailerService.sendEmail(
            newUser.email,
            'Confirm your email',
            `Click the link to confirm your email: ${confirmationUrl}`,
        );
    
        return 'Please check your email to confirm your account';
    }

    async generateEmailConfirmationToken(email: string): Promise<string> {
        const payload = { email };
        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION
        });
    }

    async verifyEmailConfirmationToken(token: string): Promise<any> {
        try {
            return this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET, // Use the same secret as in token generation
            });
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
    
    async confirmEmail(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new BadRequestException('User not found');
    
        user.isEmailConfirmed = true;
        await this.userRepository.createAndSave(user);
    }

    async validateUser(user: CreateGoogleUserInterface) {
        const existUser = await this.userRepository.findByEmail(user.email)
        if (existUser) throw new BadRequestException('This email already exist')

        const newUser = await this.userRepository.createAndSave(user)
        return newUser
    }

    async findUser(id: number) {
        const user = await this.userRepository.findById(id)
        return user
    }
}
