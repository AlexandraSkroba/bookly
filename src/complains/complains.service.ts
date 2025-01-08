import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Complain } from "./entities/complain.entity";
import { CreateComplainDto } from "./dtos/create-complain.dto";
import { Repository } from "typeorm";
import { RatingEntity } from "src/ratings/entities/rating.entity";


@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainsRepository: Repository<Complain>,
    @InjectRepository(RatingEntity)
    private readonly ratingsRepository: Repository<RatingEntity>
  ) {}

  async create(params) {
    const rating = await this.ratingsRepository.findOne({ where: { id: params.ratingId }})
    const newComplain = this.complainsRepository.create({ rating });

    const result = await this.complainsRepository.save(newComplain);
    await this.ratingsRepository.update(rating.id, { complain: result })
    return result
  }
}
