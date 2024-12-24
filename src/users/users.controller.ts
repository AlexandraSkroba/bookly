import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Get(':id')
  async show(@Req() req: Request, @Param('id') id: number) {
    return await this.usersService.findOne({
      where: { id },
      relations: ['books', 'incomingExchanges', 'outcomingExchanges'],
    });
  }

  @Get()
  async showCurrent(@Req() req: Request) {
    return await this.usersService.findOne({
      where: { id: req.currentUser.id },
      relations: ['books', 'incomingExchanges', 'outcomingExchanges'],
    });
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.usersService.uploadAvatar(req.currentUser, file);
  }

  @Get(':id/avatar')
  async getAvatar(
    @Req() req: Request,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne({
      where: { id: id ?? req.currentUser.id },
    });
    const file = createReadStream(
      join(process.cwd(), 'uploads', user.avatar || 'basic_avatar.jpg'),
    );
    file.pipe(res);
  }

  @Put()
  async update(@Req() req: Request, @Body() userParams: UpdateUserDto) {
    return await this.usersService.update(req.currentUser.id, userParams);
  }

  @Patch('update-email')
  async updateEmail(@Req() req: Request, params: UpdateEmailDto) {
    return await this.usersService.updateEmail(req.currentUser.id, params);
  }

  @Patch('update-password')
  async updatePassword(@Req() req: Request, params: UpdatePasswordDto) {
    return await this.usersService.updatePassword(req.currentUser, params);
  }
}
