import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/entities/book.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ExchangeEntity } from './entities/exchange.entity';
import { ExchangesService } from './exchanges.service';
import { ExchangesController } from './exchanges.controller';
import { BooksService } from 'src/books/books.service';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessagesService } from 'src/messages/messages.service';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExchangeEntity,
      UserEntity,
      BookEntity,
      Dialog,
      Message,
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [ExchangesService, BooksService, DialogsService, MessagesService],
  controllers: [ExchangesController],
})
export class ExchangesModule {}
