import { Injectable  } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async signUpUser(createUserDto: CreateUserDto) {
    const newUser = await this.UsersService.create(createUserDto);

    const confirmationUrl =
      process.env.APP_URL + '/auth/confirm/?token=' + newUser.confirmationToken;
    const data = {
      to: newUser.email,
      subject: 'Confirm your email',
      context: { confirmationUrl },
    };

    await this.emailQueue.add('confirmation', data, { delay: 0 });
    return 'You signed up successfully! Now please confirm your email';
  }

  async confirmUser(token: string) {
    await this.UsersService.confirmUser(token); 
    
    return 'Your accoutn has been successfully confirmed. Please log in using your credentials'
  }
}
