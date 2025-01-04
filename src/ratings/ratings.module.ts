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
import { BullModule } from '@nestjs/bull';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { Dialog } from 'src/dialogs/entities/dialog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RatingEntity,
      UserEntity,
      BookEntity,
      ExchangeEntity,
      Dialog,
    ]),
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [
    RatingsService,
    BooksService,
    UsersService,
    ExchangesService,
    DialogsService,
  ],
  controllers: [RatingsController],
})
export class RatingsModule {}
