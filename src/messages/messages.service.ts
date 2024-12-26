import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(params: CreateMessageDto, currentUser) {
    const newMessage = this.messagesRepository.create({
      text: params.text,
      author: currentUser,
    });
    return await this.messagesRepository.save(newMessage);
  }

  async registerSocket(userId: number, messagesSocketId: string) {
    return this.usersRepository.update(userId, { messagesSocketId });
  }
}
