import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "src/constants";
import { UserRepository } from "./user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
      {
        provide: USER_REPOSITORY,
        useClass: UserRepository
      }
    ],
    exports: [USER_REPOSITORY]
  })
export class UserModule { }
