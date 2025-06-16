import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { USER_REPOSITORY } from 'src/constants'
import { CreateGoogleUserInterface } from 'src/user/interfaces/create-user.interface'
import { UserRepository } from 'src/user/user.repository'
import * as argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '../user/user.service'
import { MailerService } from 'src/mailer/mailer.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { MoreThan } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private userRepository: UserRepository,
        private userService: UserService,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) {}
    async signIn(userData: CreateUserDto): Promise<string> {
        const { email, password: pass } = userData

        const user = await this.userService.findOne(email)
        if (!user?.password) throw new BadRequestException('User not found')
        if (!user.isEmailConfirmed)
            throw new UnauthorizedException('Email not confirmed')
        if (!(await argon2.verify(user.password, pass)))
            throw new UnauthorizedException('Wrong password')

        const payload = {
            email: user.email,
            sub: user.id,
            username: user.username,
        }

        return this.jwtService.signAsync(payload)
    }

    async signUp(userData: CreateUserDto): Promise<string> {
        const existUser = await this.userRepository.findByEmail(userData.email)
        if (existUser)
            throw new BadRequestException('This email already exists')

        const username = userData.username || userData.email.split('@')[0]

        const newUser = await this.userRepository.createAndSave({
            username,
            email: userData.email,
            password: await argon2.hash(userData.password),
            city: '',
        })

        void this.sendEmailConfirmation(newUser.email)

        return 'Please check your email to confirm your account'
    }

    async sendEmailConfirmation(email: string): Promise<void> {
        const token = await this.generateEmailConfirmationToken(email)

        const backendUrl =
            process.env.BACKEND_URL ||
            `http://localhost:${process.env.PORT || 3001}`
        const confirmationUrl = `${backendUrl}/auth/confirm-email?token=${token}`

        await this.mailerService.sendEmail(
            email,
            'Confirm your email',
            `Click the link to confirm your email: ${confirmationUrl}`,
        )
    }

    async generateEmailConfirmationToken(email: string): Promise<string> {
        const payload = { email }
        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION,
        })
    }

    async verifyEmailConfirmationToken(token: string): Promise<any> {
        try {
            return this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET, // Use the same secret as in token generation
            })
        } catch {
            throw new BadRequestException('Invalid or expired token')
        }
    }

    async confirmEmail(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new BadRequestException('User not found')

        user.isEmailConfirmed = true
        await this.userRepository.createAndSave(user)
    }

    async generatePasswordRecoveryToken(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new BadRequestException('User not found')

        const token = uuidv4() // Generate a unique token
        const expiration = new Date()
        expiration.setHours(expiration.getHours() + 1) // Token expires in 1 hour

        user.passwordRecoveryToken = token
        user.passwordRecoveryTokenExpires = expiration

        await this.userRepository.createAndSave(user)

        const recoveryUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
        await this.mailerService.sendEmail(
            user.email,
            'Password Recovery',
            `Click the link to reset your password: ${recoveryUrl}`,
        )
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: {
                passwordRecoveryToken: token,
                passwordRecoveryTokenExpires: MoreThan(new Date()), // Ensure the token is not expired
            },
        })

        if (!user) throw new BadRequestException('Invalid or expired token')

        user.password = await argon2.hash(newPassword)
        user.passwordRecoveryToken = null // Clear the token
        user.passwordRecoveryTokenExpires = null

        await this.userRepository.createAndSave(user)
    }

    async validateUser(user: CreateGoogleUserInterface) {
        if (!user.username) {
            user.username = user.email.split('@')[0]
        }

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
