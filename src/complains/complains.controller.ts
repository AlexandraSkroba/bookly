import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ComplainsService } from './complains.service';
import { CreateComplainDto } from './dtos/create-complain.dto';

@ApiTags('Complains')
@Controller('complains')
export class ComplainsController {
  constructor(@Inject() private readonly complainsService: ComplainsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new complaint' })
  @ApiBody({
    type: CreateComplainDto,
    description: 'Details of the complaint to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'Complaint successfully created',
  })
  async create(@Body() params: CreateComplainDto) {
    return await this.complainsService.create(params);
  }
}
