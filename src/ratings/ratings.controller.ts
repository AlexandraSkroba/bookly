import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Request } from 'express';
import { CreateRatingDTO } from './dots/create-rating.dto';
import { UpdateRatingDTO } from './dots/update-rating.dto';
import { FindRatingDTO } from './dots/find-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(@Inject() private readonly ratingsService: RatingsService) {}

  @Get()
  async index() {
    return await this.ratingsService.findAll();
  }

  @Post('by-target')
  async targetRatings(@Body() params: FindRatingDTO) {
    return await this.ratingsService.findByTarget(params);
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateRatingDTO) {
    return await this.ratingsService.create(req.currentUser.id, params);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return await this.ratingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() params: UpdateRatingDTO,
  ) {
    return await this.ratingsService.update(req.currentUser.id, id, params);
  }

  @Delete(':id')
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.ratingsService.destroy(req.currentUser.id, id);
  }
}
