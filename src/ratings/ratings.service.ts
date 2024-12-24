import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity, RatingTarget } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { ExchangesService } from 'src/exchanges/exchanges.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { UpdateRatingDTO } from './dots/update-rating.dto';
import { CreateRatingDTO } from './dots/create-rating.dto';
import { FindRatingDTO } from './dots/find-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingsRepository: Repository<RatingEntity>,
    @Inject() private readonly exchangesService: ExchangesService,
    @Inject() private readonly booksService: BooksService,
    @Inject() private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<RatingEntity[]> {
    return this.ratingsRepository.find();
  }

  async findOne(id: number) {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: [''],
    });
    const target = await this.loadTarget(rating.targetType, rating.targetId);
    return { ...rating, target };
  }

  async loadTarget(targetType, targetId) {
    if (targetType === RatingTarget.exchange) {
      return this.exchangesService.findOne(targetId, ['from', 'to', 'book']);
    } else if (targetType === RatingTarget.book) {
      return this.booksService.findOne(targetId, { id: targetId });
    } else {
      return this.usersService.findOne({ where: { id: targetId } });
    }
  }

  async findByTarget(params: FindRatingDTO) {
    return this.ratingsRepository.find({ where: params });
  }

  async create(ownerId, params: CreateRatingDTO) {
    const existingRating = await this.ratingsRepository.findOne({
      where: {
        targetType: params.targetType,
        targetId: params.targetId,
        owner: { id: ownerId },
      },
    });
    if (existingRating) {
      throw new BadRequestException(
        `You already rated this ${params.targetType}`,
      );
    }
    const newRating = this.ratingsRepository.create({
      ...params,
      owner: { id: ownerId },
    });

    return this.ratingsRepository.save(newRating);
  }

  async update(ownerId, id: number, params: UpdateRatingDTO) {
    const rating = await this.ratingsRepository.findOne({
      where: { id, owner: { id: ownerId } },
    });
    if (!rating) {
      throw new NotFoundException();
    }

    return this.ratingsRepository.update(id, { ...params });
  }

  async destroy(ownerId, id) {
    const rating = this.ratingsRepository.findOne({
      where: { id, owner: { id: ownerId } },
    });
    if (!rating) {
      throw new NotFoundException();
    }

    return this.ratingsRepository.delete(id);
  }
}
