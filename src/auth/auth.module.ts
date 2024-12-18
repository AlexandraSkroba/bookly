import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailProcessor } from 'src/mail/mail.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [UsersModule, BullModule.registerQueue({ name: 'email' })],
  providers: [AuthService, UsersService, EmailProcessor],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
