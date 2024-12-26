import { Inject, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    @Inject() private messagesService: MessagesService,
    @Inject() private usersService: UsersService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('register', async (userId: number) => {
        await this.messagesService.registerSocket(userId, socket.id);
      });
    });
  }

  async handleMessage(dialogId: number, text: string) {
    const socketIds = await this.usersService.find({
      where: { dialogs: { id: In([dialogId]) } },
      relations: ['dialogs'],
    });
    socketIds.map((user, _index) => {
      this.server.to(user.socketId).emit('message', { dialogId, text });
    });
  }
}
