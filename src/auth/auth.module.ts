import 'dotenv/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AUTH_SERVICE } from 'src/constants'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserEntity } from 'src/user/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { GoogleStrategy } from './utils/google.strategy'
import { SessionSerializer } from './utils/serializer'
import { MailerModule } from 'src/mailer/mailer.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        UserModule,
        MailerModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRATION,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        GoogleStrategy,
        SessionSerializer,
        {
            provide: AUTH_SERVICE,
            useClass: AuthService,
        },
    ],
    exports: [AUTH_SERVICE],
})
export class AuthModule {}
