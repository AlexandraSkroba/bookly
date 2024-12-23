import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Req,
  Patch,
  Query,
  Body,
} from '@nestjs/common';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { ExchangesService } from './exchanges.service';
import { Request } from 'express';

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
    @Query('state') state: string,
  ) {
    return await this.exchangesService.updateState(id, state, req.currentUser);
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.exchangesService.delete(id, req.currentUser);
  }
}
