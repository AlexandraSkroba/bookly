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
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  // Return current user to clarify things on frontend, f.e. if he's the owner of given record
  @Get('/current')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user object',
  })
  async getCurrent(@Req() req: Request) {
    return req.currentUser;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user information',
  })
  async show(@Req() req: Request, @Param('id') id: number) {
    return await this.usersService.findOne({
      where: { id },
      relations: ['books', 'incomingExchanges', 'outcomingExchanges'],
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get information about the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns information about the current user',
  })
  async showCurrent(@Req() req: Request) {
    return await this.usersService.findOne({
      where: { id: req.currentUser.id },
      relations: ['books', 'incomingExchanges', 'outcomingExchanges'],
    });
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
  })
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
  @ApiOperation({ summary: 'Get user avatar' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'User identifier (optional)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns avatar file',
  })
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
  @ApiOperation({ summary: 'Update user data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User data updated successfully',
  })
  async update(@Req() req: Request, @Body() userParams: UpdateUserDto) {
    return await this.usersService.update(req.currentUser.id, userParams);
  }

  @Patch('update-email')
  @ApiOperation({ summary: 'Update user email' })
  @ApiBody({ type: UpdateEmailDto })
  @ApiResponse({
    status: 200,
    description: 'User email updated successfully',
  })
  async updateEmail(@Req() req: Request, @Body() params: UpdateEmailDto) {
    return await this.usersService.updateEmail(req.currentUser.id, params);
  }

  @Patch('update-password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'User password updated successfully',
  })
  async updatePassword(@Req() req: Request, @Body() params: UpdatePasswordDto) {
    return await this.usersService.updatePassword(req.currentUser, params);
  }
}
