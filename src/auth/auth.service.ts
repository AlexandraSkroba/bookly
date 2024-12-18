import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private UsersService: UsersService) {}

  async signUpUser(createUserDto: CreateUserDto) {
    const newUser = await this.UsersService.create(createUserDto);

    if (newUser) {
      // Schedule confirmation email and return successful response here
    }
  }
}
