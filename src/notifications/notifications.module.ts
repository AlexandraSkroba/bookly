import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { BullModule } from '@nestjs/bull';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, UserEntity, BookEntity]),
            BullModule.registerQueue({ name: 'email' }),
          ],
  providers: [NotificationsService, NotificationsGateway, UsersService, BooksService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
