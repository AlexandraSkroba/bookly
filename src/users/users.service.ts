import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email has already been taken');
    } else {
      const user = this.usersRepository.create({
        ...createUserDto,
      });

      return await this.usersRepository.save(user);
    }
  }

  async confirmUser(token: string) {
    const user = await this.usersRepository.findOneBy({ confirmationToken: token });

    if (!user) {
      throw new NotFoundException('Wrong confirmation token provided')
    } else if (user.isConfirmed) {
      throw new ConflictException('Account is already confirmed')
    } else {
      return await this.usersRepository.update(user.id, { isConfirmed: true})
    }
  }
}
