import { Inject, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@WebSocketGateway({ cord: true })
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject() private readonly dialogsService: DialogsService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('connection', async (userId: number) => {
        await this.dialogsService.addUser(userId, socket.id);
      });
    });
  }

  async pushMessage(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['author', 'dialog', 'dialog.users'],
    });
    const socketIds = message.dialog.users.map((user) => user.messagesSocketId);
    this.handleMessage(socketIds, message);
  }

  async handleMessage(socketIds: string[], message: Message) {
    socketIds.map((id, _i) => {
      this.server.to(id).emit('new.message', {
        id: message.id,
        text: message.text,
        author: message.author,
      });
    });
  }
}
