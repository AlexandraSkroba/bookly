import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [ConfigModule.forRoot(),
            DatabaseModule,
            UserModule,
            AuthModule,
            BullModule.forRoot({
              connection: {
                host: process.env.REDIT_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT) || 6379
              }
            }),
            BullModule.registerQueue({
              name: 'confirmation'
            })]
})
export class AppModule {}
