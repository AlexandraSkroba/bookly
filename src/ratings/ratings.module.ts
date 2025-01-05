import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingEntity } from './entities/rating.entity';
import { BookEntity } from 'src/books/entities/book.entity';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { ExchangesService } from 'src/exchanges/exchanges.service';
import { BullModule } from '@nestjs/bullmq';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RatingEntity,
      UserEntity,
      BookEntity,
      ExchangeEntity,
      Dialog,
      Message,
    ]),
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [
    RatingsService,
    BooksService,
    UsersService,
    ExchangesService,
    DialogsService,
    MessagesService,
  ],
  controllers: [RatingsController],
})
export class RatingsModule {}
