import { Controller, Delete, Get, Inject, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject() private readonly notificationsService: NotificationsService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Find all notifications' })
  @ApiResponse({ status: 200 })
  async index(@Req() req: Request) {
    return await this.notificationsService.findAll();
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: 200 })
  async usersNotifications(@Req() req: Request) {
    return await this.notificationsService.findForCurrentUser(
      req.currentUser.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async destroy(@Req() req: Request, @Param('id') id: number) {
    await this.notificationsService.destroy(id, req.currentUser.id);
  }
}
