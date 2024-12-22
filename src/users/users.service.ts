import { compare } from 'bcrypt';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { NewPasswordDto } from 'src/auth/dtos/new-password.dto';

@Injectable()
export class UsersService {
  private confirmationResult: Boolean;

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findOne(params: Object) {
    const user = await this.usersRepository.findOne(params);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOne({
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

  async update(userId, params) {
    return await this.usersRepository.update(userId, params);
  }

  async confirmUser(confirmationToken: string) {
    const user = await this.findOne({ where: { confirmationToken } });

    if (!user) {
      throw new NotFoundException('Wrong confirmation token provided');
    } else if (user.isConfirmed) {
      throw new ConflictException('Account is already confirmed');
    } else {
      return await this.usersRepository.update(user.id, { isConfirmed: true });
    }
  }

  async authenticate(credentials: SignInDto) {
    const user = await this.findOne({
      where: {
        isConfirmed: true,
        email: credentials.email,
      },
    });
    if (!user) {
      throw new NotFoundException('Email is incorrect');
    }

    if (await compare(credentials.password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Provided bad credentials');
  }

  async resetPassword(token: string) {
    const user = await this.findOne({
      where: { resetPasswordToken: token, isConfirmed: true },
    });
    if (!user) {
      throw new NotFoundException();
    }

    await this.usersRepository.update(user.id, { password: '' });
    return user;
  }

  async setNewPassword(newPasswordParams: NewPasswordDto) {
    const user = await this.findOne({
      where: {
        resetPasswordToken: newPasswordParams.resetPasswordToken,
        isConfirmed: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    user.password = newPasswordParams.newPassword;
    await user.encryptPassword();

    compare(newPasswordParams.newPassword, user.password, (_err, res) => {
      console.log(res);
    });

    return await this.usersRepository.update(user.id, {
      password: user.password,
      resetPasswordToken: null,
    });
  }
}
