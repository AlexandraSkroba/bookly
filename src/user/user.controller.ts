import { Body, Controller, Inject, Post } from '@nestjs/common';
import { USER_SERVICE } from 'src/constants';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
