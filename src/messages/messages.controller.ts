import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(@Inject() private messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get messages by dialog ID' })
  @ApiQuery({
    name: 'dialogId',
    type: Number,
    description: 'ID of the dialog to fetch messages from',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of messages for the specified dialog',
  })
  async index(@Req() req: Request, @Query('dialogId') dialogId: number) {
    return await this.messagesService.find(dialogId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiBody({
    type: CreateMessageDto,
    description: 'Data to create a new message',
  })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created',
  })
  async create(@Req() req: Request, @Body() params: CreateMessageDto) {
    return await this.messagesService.create(
      params,
      req.currentUser,
      null,
      true,
    );
  }
}
