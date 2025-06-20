import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common'
import { UserRepository } from './user.repository'
import { AUTH_SERVICE, USER_REPOSITORY } from 'src/constants'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { AuthService } from 'src/auth/auth.service'
import { GenreRepository } from 'src/genre/genre.repository'

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: UserRepository,
        @Inject(forwardRef(() => AUTH_SERVICE))
        private authService: AuthService, // resolve circular dependencies using forwardRef
        private readonly genreRepository: GenreRepository,
    ) {}

    async findById(userId: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new BadRequestException('User not found')
        return user
    }

    async findOne(email: string) {
        return await this.userRepository.findByEmail(email)
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new BadRequestException('User not found')

        if (dto.username) {
            user.username = dto.username
        }
        if (dto.email && dto.email !== user.email) {
            user.email = dto.email
            user.isEmailConfirmed = false
            await this.authService.sendEmailConfirmation(user.email)
        }
        if (dto.avatar) {
            user.avatar = dto.avatar
        }
        if (dto.preferenceGenreIds) {
            const genres = await this.genreRepository.findByIds(
                dto.preferenceGenreIds,
            )
            user.preferences = genres
        }
        if (dto.city) {
            user.city = dto.city
        }

        await this.userRepository.createAndSave(user)
        return user
    }

    async deleteUser(userId: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new BadRequestException('User not found')
        await this.userRepository.removeUser(user)
    }
}
