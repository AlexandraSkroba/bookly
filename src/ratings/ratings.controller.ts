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
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDTO } from './dots/create-rating.dto';
import { UpdateRatingDTO } from './dots/update-rating.dto';
import { RatingTarget } from './entities/rating.entity';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(@Inject() private readonly ratingsService: RatingsService) {}

  @Get()
  @ApiOperation({ summary: 'Find all ratings' })
  @ApiResponse({ status: 200 })
  async index() {
    return await this.ratingsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a rating' })
  @ApiBody({ type: CreateRatingDTO })
  @ApiResponse({ status: 201 })
  async create(@Req() req: Request, @Body() params: CreateRatingDTO) {
    return await this.ratingsService.create(req.currentUser.id, params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a rating by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async show(@Param('id') id: number) {
    return await this.ratingsService.findOne(id);
  }

  @Get(':targetType/:id')
  @ApiOperation({ summary: 'Find a rating by targetType and ID' })
  @ApiParam({ name: 'targetType', enum: RatingTarget })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async findByTarget(
    @Req() req: Request,
    @Param('targetType') targetType: RatingTarget,
    @Param('id') id: number,
  ) {
    return await this.ratingsService.findByTarget({ targetType, targetId: id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rating' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRatingDTO })
  @ApiResponse({ status: 200 })
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() params: UpdateRatingDTO,
  ) {
    return await this.ratingsService.update(req.currentUser.id, id, params);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async destroy(@Req() req: Request, @Param('id') id: number) {
    return await this.ratingsService.destroy(req.currentUser.id, id);
  }
}
