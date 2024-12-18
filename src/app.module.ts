import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
            ConfigModule.forRoot(),
            DatabaseModule,
            MailerModule,
            UsersModule,
            AuthModule,
          ]
})
export class AppModule {}
