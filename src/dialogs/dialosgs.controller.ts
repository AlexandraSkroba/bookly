import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DialogsService } from './dialogs.service';
import { Request } from 'express';
import { CreateDialogDto } from './dto/create-dialog.dto';

@ApiTags('Dialogs')
@Controller('dialogs')
export class DialogsController {
  constructor(@Inject() private dialogsService: DialogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dialogs for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of all dialogs for the current user',
  })
  async index(@Req() req: Request) {
    return await this.dialogsService.findAll(req.currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific dialog' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the dialog to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the specified dialog',
  })
  async show(@Req() req: Request, @Param('id') id: number) {
    return await this.dialogsService.findOne(id, req.currentUser.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new dialog' })
  @ApiBody({
    type: CreateDialogDto,
    description: 'Details for creating a new dialog',
  })
  @ApiResponse({
    status: 201,
    description: 'Dialog successfully created',
  })
  async create(@Req() req: Request, @Body() params: CreateDialogDto) {
    return await this.dialogsService.create(params, req.currentUser);
  }

  @Post('fetch-dialog')
  @ApiOperation({
    summary: 'Fetch a dialog or create a new one if it does not exist',
  })
  @ApiBody({
    type: CreateDialogDto,
    description: 'Details for fetching or creating a dialog',
  })
  @ApiResponse({
    status: 200,
    description: 'Dialog fetched or newly created',
  })
  async fetchDialog(@Req() req: Request, @Body() params: CreateDialogDto) {
    return await this.dialogsService.create(
      params,
      req.currentUser,
      true,
      false,
    );
  }

  @Get(':id/subjects')
  @ApiOperation({
    summary: 'Get the subjects associated with a specific dialog',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the dialog to fetch subjects for',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of subjects associated with the specified dialog',
  })
  async subjects(@Req() req: Request, @Param('id') id: number) {
    return await this.dialogsService.findSubjects(id);
  }
}
