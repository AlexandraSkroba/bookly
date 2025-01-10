import { Module } from '@nestjs/common';
import { ComplainsService } from './complains.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complain } from './entities/complain.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';
import { ComplainsController } from './complains.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Complain, RatingEntity])],
  providers: [ComplainsService],
  controllers: [ComplainsController],
})
export class ComplainsModule {}
