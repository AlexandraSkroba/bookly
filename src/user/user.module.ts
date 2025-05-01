import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "src/constants";
import { UserRepository } from "./user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
      UserService,
      {
        provide: USER_REPOSITORY,
        useClass: UserRepository
      }
    ],
    exports: [USER_REPOSITORY, UserService]
  })
export class UserModule { }
