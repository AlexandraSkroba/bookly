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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RatingEntity,
      UserEntity,
      BookEntity,
      ExchangeEntity,
    ]),
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [RatingsService, BooksService, UsersService, ExchangesService],
  controllers: [RatingsController],
})
export class RatingsModule {}
