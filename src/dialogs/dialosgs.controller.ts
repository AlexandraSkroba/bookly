import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { Request } from 'express';
import { CreateDialogDto } from './dto/create-dialog.dto';

@Controller('dialogs')
export class DialogsController {
  constructor(@Inject() private dialogsService: DialogsService) {}

  @Get()
  async index(@Req() req: Request) {
    return await this.dialogsService.findAll(req.currentUser);
  }

  @Get(':id')
  async show(@Req() req: Request, @Param('id') id: number) {
    return await this.dialogsService.findOne(id, req.currentUser.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateDialogDto) {
    return await this.dialogsService.create(params, req.currentUser);
  }

  @Post('fetch-dialog')
  async fetchDialog(@Req() req: Request, @Body() params: CreateDialogDto) {
    return await this.dialogsService.create(
      params,
      req.currentUser,
      true,
      false,
    );
  }

  @Get(':id/subjects')
  async subjects(@Req() req: Request, @Param('id') id: number) {
    return await this.dialogsService.findSubjects(id);
  }
}
