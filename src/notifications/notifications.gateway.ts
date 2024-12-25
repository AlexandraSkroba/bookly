import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(private notificationsService: NotificationsService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('register', async (userId: number) => {
        await this.notificationsService.addUser(userId, socket.id);
      });
    });
  }

  async handleNotification(userIds: number[], id: number, text: string) {
    const socketIds = await this.notificationsService.sendNotification(userIds);
    socketIds.map((id, _i) => {
      this.server.to(id).emit('notification', { text, id });
    });
  }

  async triggerSample(currentUserId: number) {
    const notification = await this.notificationsService.create(
      'This is a test notification',
      [currentUserId],
    );

    await this.handleNotification(
      [currentUserId],
      notification.id,
      notification.text,
    );
  }
}
