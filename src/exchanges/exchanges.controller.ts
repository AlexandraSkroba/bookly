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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { ExchangesService } from './exchanges.service';
import { Request } from 'express';
import { UpdateStateDto } from './dtos/update-state.dto';

@ApiTags('Exchanges')
@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exchanges for the current user' })
  @ApiResponse({ status: 200, description: 'List of exchanges' })
  async index(@Req() req: Request) {
    return await this.exchangesService.findAll(req.currentUser);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new exchange' })
  @ApiBody({
    type: CreateExchangeDto,
    description: 'Details for creating a new exchange',
  })
  @ApiResponse({ status: 201, description: 'Exchange successfully created' })
  async create(@Req() req: Request, @Body() params: CreateExchangeDto) {
    return await this.exchangesService.create(params, req.currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific exchange' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the exchange to retrieve',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Details of the exchange' })
  async show(@Param('id') id: number) {
    return await this.exchangesService.findOne(id);
  }

  @Patch(':id/update-state')
  @ApiOperation({ summary: 'Update the state of a specific exchange' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the exchange to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateStateDto,
    description: 'Details for updating the state of the exchange',
  })
  @ApiResponse({
    status: 200,
    description: 'Exchange state successfully updated',
  })
  async updateState(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() params: UpdateStateDto,
  ) {
    return await this.exchangesService.updateState(id, params, req.currentUser);
  }

  @Get('delivery-state/:id')
  @ApiOperation({ summary: 'Get the delivery state of a specific exchange' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the exchange to retrieve delivery state',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery state of the specified exchange',
  })
  async getDeliveryState(@Param('id') id: number) {
    return await this.exchangesService.getDeliveryState(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific exchange' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the exchange to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Exchange successfully deleted' })
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.exchangesService.delete(id, req.currentUser);
  }
}
