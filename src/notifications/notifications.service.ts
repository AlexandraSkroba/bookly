import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return this.notificationsRepository.find();
  }

  async findForCurrentUser(id: number) {
    return this.notificationsRepository.find({ where: { users: { id } } });
  }

  async addUser(userId: number, socketId) {
    await this.usersRepository.update(userId, { socketId });
  }

  async sendNotification(userIds: number[]) {
    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
    });
    return users.map((user, _ind) => {
      return user.socketId;
    });
  }

  async create(text: string, userIds: number[]): Promise<Notification> {
    const notification = await this.notificationsRepository.create({ text });
    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
    });
    notification.users = users;
    return this.notificationsRepository.save(notification);
  }

  async destroy(id: number, userId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    notification.users = notification.users.filter(
      (user, _index) => user.id !== userId,
    );

    return this.notificationsRepository.save(notification);
  }
}
