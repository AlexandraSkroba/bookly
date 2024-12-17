import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { USER_SERVICE } from 'src/constants';
import { User } from 'src/typeorm/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserRepository,
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
  ],
  exports: [UserRepository, USER_SERVICE],
})
export class UsersModule {}
