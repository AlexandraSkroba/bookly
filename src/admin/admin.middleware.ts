import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser.is_admin) {
      throw new UnauthorizedException("You don't have acces to this section");
    }

    next();
  }
}
