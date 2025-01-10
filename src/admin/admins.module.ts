import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/entities/book.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AdminsService } from './admins.service';
import { Complain } from 'src/complains/entities/complain.entity';
import { AdminMiddleware } from './admin.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ExchangeEntity,
      BookEntity,
      Complain,
    ]),
  ],
  providers: [AdminsService],
  controllers: [],
})
export class AdminsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('admin(.*)');
  }
}
