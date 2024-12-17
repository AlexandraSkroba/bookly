import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/user';
import { Repository } from 'typeorm';
import { CreateUserData } from './interface/create-user.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAndSave(userData: CreateUserData): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
