import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { NotificationsService } from "./notifications.service";

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

  async handleNotification(userIds: number[], text: string) {
    const socketIds = await this.notificationsService.sendNotification(userIds);
    socketIds.map((id, _i) => {
      this.server.to(id).emit('notification', text)
    })
  }

  async triggerSample(currentUserId: number) {
    await this.handleNotification([currentUserId], 'This is a test notification');
  }
}
