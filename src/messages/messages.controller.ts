import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(@Inject() private messagesService: MessagesService) {}

  @Get()
  async index(@Req() req: Request, @Query('dialogId') dialogId: number) {
    return await this.messagesService.find(dialogId);
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateMessageDto) {
    return await this.messagesService.create(
      params,
      req.currentUser,
      null,
      true,
    );
  }
}
