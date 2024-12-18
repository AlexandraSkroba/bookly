import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailProcessor } from 'src/mail/mail.processor';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    BullModule.registerQueue({ name: 'email' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UsersService, EmailProcessor],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
