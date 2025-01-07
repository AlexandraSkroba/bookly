import { OnEvent } from '@nestjs/event-emitter';
import { NewMessageEvent } from './events/new-message.event';
import { MessagesService } from './messages.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { Repository } from 'typeorm';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesListener {
  constructor(
    private readonly messagesService: MessagesService,
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @OnEvent('new.message', { async: true })
  async handleNewMessageEvent(event: NewMessageEvent) {
    const { id } = event;
    this.messagesGateway.pushMessage(id);
  }
}
