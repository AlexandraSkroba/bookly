import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/entities/book.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ExchangeEntity } from './entities/exchange.entity';
import { ExchangesService } from './exchanges.service';
import { ExchangesController } from './exchanges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeEntity, UserEntity, BookEntity])],
  providers: [ExchangesService],
  controllers: [ExchangesController],
})
export class ExchangesModule {}
