import { Injectable } from '@nestjs/common';
import { CreateUserData } from 'src/user/interface/create-user.interface';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(createUserData: CreateUserData) {
    const existingUser = await this.userRepository.findByEmail(
      createUserData.email,
    );
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    await this.userRepository.createAndSave(createUserData);

    return {
      message: 'User registered successfully. Please confirm your email.',
    };
  }
}
