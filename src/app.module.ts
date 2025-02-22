import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './mail/mail.module';
import { AppController } from './app.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { BooksModule } from './books/books.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { RatingsModule } from './ratings/ratings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagesModule } from './messages/messages.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { ComplainsModule } from './complains/complains.module';
import { AdminsModule } from './admin/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MailModule,
    UsersModule,
    AuthModule,
    BooksModule,
    ExchangesModule,
    RatingsModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'maddison',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
    MessagesModule,
    SubscriptionsModule,
    DialogsModule,
    ComplainsModule,
    AdminsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude({ path: '/', method: RequestMethod.GET }, 'auth(.*)').forRoutes('*');
  }
}
