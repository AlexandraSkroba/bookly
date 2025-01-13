import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @Inject() private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать подписку' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({ status: 201, description: 'Подписка успешно создана' })
  async create(@Req() req: Request, @Body() params: CreateSubscriptionDto) {
    return await this.subscriptionsService.create(params, req.currentUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить подписку' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Идентификатор подписки',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Подписка успешно удалена' })
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.subscriptionsService.destroy(id);
  }
}
