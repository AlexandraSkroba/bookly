import { Injectable } from '@nestjs/common'
import { Repository, FindOptionsWhere } from 'typeorm'
import { UserEntity } from './entities/user.entity'
import {
    CreateGoogleUserInterface,
    CreateUserInterface,
} from './interfaces/create-user.interface'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    // async createAndSave(user: CreateUserInterface): Promise<UserEntity>
    // async createAndSave(user: CreateGoogleUserInterface): Promise<UserEntity>
    // async createAndSave(
    //     user: CreateUserInterface | CreateGoogleUserInterface,
    // ): Promise<UserEntity> {
    async createAndSave(user: Partial<UserEntity>): Promise<UserEntity> {
        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    async findOne(options: {
        where: FindOptionsWhere<UserEntity>
    }): Promise<UserEntity | null> {
        return this.userRepository.findOne(options)
    }

    async findByEmail(email: string) {
        const existUser = await this.userRepository.findOne({
            where: { email },
        })
        return existUser
    }

    async findById(id: number) {
        return this.userRepository.findOne({ where: { id } })
    }

    async removeUser(user: UserEntity) {
        return this.userRepository.remove(user)
    }
}
