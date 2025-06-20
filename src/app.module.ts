import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { PassportModule } from '@nestjs/passport'
import { UserService } from './user/user.service'
import { MailerService } from './mailer/mailer.service'
import { MailerModule } from './mailer/mailer.module'
import { BookModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.js,.ts}'],
                synchronize: true,
            }),
        }),
        PassportModule.register({ session: true }),
        AuthModule,
        UserModule,
        MailerModule,
        BookModule,
        GenreModule,
    ],
    providers: [UserService, MailerService],
    exports: [UserService],
})
export class AppModule {}
