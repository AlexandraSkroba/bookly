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

  @Get(':id')
  async show(@Req() req: Request, @Param('id') id: number) {
    return await this.dialogsService.findOne(id, req.currentUser.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateDialogDto) {
    return await this.dialogsService.create(params, req.currentUser);
  }
}
