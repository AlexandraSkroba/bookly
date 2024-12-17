import { Injectable } from '@nestjs/common';
import { CreateUserData } from './interface/create-user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserData: CreateUserData) {
    const newUser = await this.userRepository.createAndSave(createUserData);
    return newUser;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
