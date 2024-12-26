import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Request } from 'express';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @Inject() private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() params: CreateSubscriptionDto) {
    return await this.subscriptionsService.create(params, req.currentUser);
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.subscriptionsService.destroy(id);
  }
}
