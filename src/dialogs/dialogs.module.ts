import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from './entities/dialog.entity';
import { Message } from 'src/messages/entities/message.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DialogsService } from './dialogs.service';
import { DialogsController } from './dialosgs.controller';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dialog, Message, UserEntity, ExchangeEntity]),
  ],
  providers: [DialogsService],
  controllers: [DialogsController],
})
export class DialogsModule {}
