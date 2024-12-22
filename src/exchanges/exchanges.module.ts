import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/entities/book.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ExchangeEntity } from './entities/exchange.entity';
import { ExchangesService } from './exchanges.service';
import { ExchangesController } from './exchanges.controller';
import { BooksService } from 'src/books/books.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeEntity, UserEntity, BookEntity])],
  providers: [ExchangesService, BooksService],
  controllers: [ExchangesController],
})
export class ExchangesModule {}
