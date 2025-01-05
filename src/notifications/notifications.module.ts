import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { BullModule } from '@nestjs/bullmq';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangesService } from 'src/exchanges/exchanges.service';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsListener } from './notifications.listener';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      UserEntity,
      BookEntity,
      ExchangeEntity,
      Dialog,
      Message,
    ]),
    BullModule.registerQueue({ name: 'email' }),
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
  ],
  providers: [
    NotificationsService,
    NotificationsGateway,
    UsersService,
    BooksService,
    ExchangesService,
    DialogsService,
    NotificationsListener,
    MessagesService,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
