import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { MessagesService } from './messages.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { UsersService } from 'src/users/users.service';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessagesListener } from './messages.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dialog, Message, UserEntity, ExchangeEntity]),
    BullModule.registerQueue({ name: 'email' }),
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
  ],
  providers: [
    MessagesService,
    DialogsService,
    UsersService,
    MessagesGateway,
    MessagesListener,
  ],
  controllers: [MessagesController],
})
export class MessagesModule {}
