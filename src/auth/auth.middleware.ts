import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers?.authorization) {
      throw new UnauthorizedException(
        'Insufficient permissions to access this resource',
      );
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      req.currentUser = user;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Revoked token');
      }

      throw new UnauthorizedException(e.message);
    }
    next();
  }
}
