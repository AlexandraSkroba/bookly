import { Controller, Get, Inject, Req } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Request } from "express";
import { NotificationsGateway } from "./notifications.gateway";


@Controller('notifications')
export class NotificationsController {
  constructor(@Inject() private readonly notificationsService: NotificationsService,
              private readonly notificationsGateway: NotificationsGateway) {}

  @Get('')
  async index(@Req() req: Request) {
    return await this.notificationsService.findAll();
  }

  @Get('test')
  async test(@Req() req: Request) {
    return await this.notificationsGateway.triggerSample(req.currentUser.id);
  }
}
