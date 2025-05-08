import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { USER_REPOSITORY } from 'src/constants'

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    ) {}

    async findOne(email: string) {
        return await this.userRepository.findByEmail(email)
    }
}
