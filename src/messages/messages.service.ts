import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageSentEvent } from 'src/notifications/events/message-sent.event';
import { Dialog } from 'src/dialogs/entities/dialog.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    params: CreateMessageDto,
    currentUser,
    dialog: Dialog = null,
    pushNotification: boolean = true,
  ) {
    if (!dialog) {
      if (!params.dialogId) {
        throw new BadRequestException('Bad params provided');
      }
      dialog = await this.dialogsRepository.findOne({
        where: { id: params.dialogId },
      });
    }

    const newMessage = this.messagesRepository.create({
      text: params.text,
      author: currentUser,
      dialog,
    });

    if (pushNotification) {
      const recipients = dialog.users
        .filter((user) => user.id !== currentUser.id)
        .map((user) => user.id);
      this.eventEmitter.emit(
        'message.sent',
        new MessageSentEvent(
          currentUser.id,
          currentUser.username,
          recipients,
          dialog.id,
        ),
      );
    }
    return await this.messagesRepository.save(newMessage);
  }

  async registerSocket(userId: number, messagesSocketId: string) {
    return this.usersRepository.update(userId, { messagesSocketId });
  }
}
