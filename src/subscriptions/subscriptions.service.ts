import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(UserEntity)
    private readonly userssRepository: Repository<UserEntity>,
  ) {}

  async find(params) {
    return await this.subscriptionsRepository.find(params);
  }

  async create(params: CreateSubscriptionDto, currentUser) {
    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        subscriber: { id: currentUser.id },
        subscribed: { id: params.userId },
      },
      relations: ['subscribed', 'subscriber'],
    });
    if (existingSubscription) {
      throw new ConflictException("You're already subscribed to this user");
    }

    const newSubscription = this.subscriptionsRepository.create();
    const subscribed = this.userssRepository.findOne({
      where: { id: params.userId },
    });
    if (!subscribed) {
      throw new NotFoundException();
    }

    newSubscription.subscribed = await subscribed;
    newSubscription.subscriber = currentUser;
    return this.userssRepository.save(newSubscription);
  }

  async destroy(id) {
    return this.subscriptionsRepository.delete(id);
  }
}
