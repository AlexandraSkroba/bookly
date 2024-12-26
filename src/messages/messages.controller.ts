import { Controller, Inject, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(@Inject() private messagesService: MessagesService) {}

  @Post()
  async create(@Req() req: Request, params: CreateMessageDto) {
    return await this.messagesService.create(params, req.currentUser);
  }
}
