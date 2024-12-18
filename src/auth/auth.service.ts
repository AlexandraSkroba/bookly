import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUpUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    if (newUser) {
      // Schedule confirmation email and return successful response here
    }
  }
}
