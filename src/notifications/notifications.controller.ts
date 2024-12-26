import { Controller, Delete, Get, Inject, Param, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject() private readonly notificationsService: NotificationsService,
  ) {}

  @Get('')
  async index(@Req() req: Request) {
    return await this.notificationsService.findAll();
  }

  @Get('current')
  async usersNotifications(@Req() req: Request) {
    return await this.notificationsService.findForCurrentUser(
      req.currentUser.id,
    );
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') id: number) {
    await this.notificationsService.destroy(id, req.currentUser.id);
  }
}
