import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { ExchangesService } from './exchanges.service';
import { Request } from 'express';
import { UpdateStateDto } from './dtos/update-state.dto';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Get()
  async index(@Req() req: Request) {
    return await this.exchangesService.findAll(req.currentUser);
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateExchangeDto) {
    return await this.exchangesService.create(params, req.currentUser);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return await this.exchangesService.findOne(id);
  }

  @Patch(':id/update-state')
  async updateState(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() params: UpdateStateDto,
  ) {
    return await this.exchangesService.updateState(id, params, req.currentUser);
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.exchangesService.delete(id, req.currentUser);
  }
}
