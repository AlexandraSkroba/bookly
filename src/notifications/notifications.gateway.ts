import { Inject, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(
    @Inject() private notificationsService: NotificationsService,
    @Inject() private readonly usersService: UsersService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('register', async (userId: number) => {
        await this.notificationsService.addUser(userId, socket.id);
      });
    });
  }

  async sendNotification(id: number, subject: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    const userIds = notification.users.map((user, _index) => {
      return user.id;
    });
    this.handleNotification(userIds, subject, notification.text);
  }

  async handleNotification(userIds: number[], subject: string, text: string) {
    const socketIds = await this.notificationsService.getSockets(userIds);
    socketIds.map((id, _i) => {
      this.server.to(id).emit('notification', { text, id });
    });

    await this.notifyByEmail(userIds, subject, text);
  }

  async notifyByEmail(userIds: number[], subject: string, message: string) {
    const users = await this.usersService.find({ where: { id: In(userIds) } });
    users.forEach((user) => {
      let data = {
        to: user.email,
        subject: subject,
        context: { message },
      };
      this.emailQueue.add('notification', data, { delay: 0 });
    });
  }
}
