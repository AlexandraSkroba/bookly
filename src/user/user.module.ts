import { forwardRef, Module } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/constants'
import { UserRepository } from './user.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule),
    ],
    providers: [
        UserService,
        // AuthService,
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
    ],
    exports: [USER_REPOSITORY, UserService],
    controllers: [UserController],
})
export class UserModule {}
