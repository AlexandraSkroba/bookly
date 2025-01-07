import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Request } from 'express';
import { CreateRatingDTO } from './dots/create-rating.dto';
import { UpdateRatingDTO } from './dots/update-rating.dto';
import { RatingTarget } from './entities/rating.entity';

@Controller('ratings')
export class RatingsController {
  constructor(@Inject() private readonly ratingsService: RatingsService) {}

  @Get()
  async index() {
    return await this.ratingsService.findAll();
  }

  @Post()
  async create(@Req() req: Request, @Body() params: CreateRatingDTO) {
    return await this.ratingsService.create(req.currentUser.id, params);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return await this.ratingsService.findOne(id);
  }

  @Get(':targetType/:id')
  async findByTarget(@Req() req: Request, @Param('targetType') targetType: RatingTarget, @Param('id') id: number) {
    return await this.ratingsService.findByTarget({ targetType, targetId: id });
  }

  @Patch(':id')
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
