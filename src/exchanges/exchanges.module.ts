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

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeEntity, UserEntity, BookEntity, Dialog]),
    EventEmitterModule.forRoot(),
  ],
  providers: [ExchangesService, BooksService, DialogsService],
  controllers: [ExchangesController],
})
export class ExchangesModule {}
