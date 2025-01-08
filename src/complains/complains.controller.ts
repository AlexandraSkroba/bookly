import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ComplainsService } from "./complains.service";
import { CreateComplainDto } from "./dtos/create-complain.dto";


@Controller('complains')
export class ComplainsController {
  constructor(@Inject() private readonly complainsService: ComplainsService) {}

  @Post()
  async create(@Body() params: CreateComplainDto) {
    return await this.complainsService.create(params);
  }
}
