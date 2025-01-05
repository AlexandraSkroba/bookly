import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { BooksController } from './books.controller';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, UserEntity]),
    EventEmitterModule.forRoot(),
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
