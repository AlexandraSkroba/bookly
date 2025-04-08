import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserInterface } from "./interfaces/create-user.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async createAndSave(user: CreateUserInterface) {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async findByEmail(user: CreateUserInterface) {
        const existUser = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })
        return existUser
    }
} 
