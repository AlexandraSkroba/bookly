/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Inject, Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { AUTH_SERVICE } from 'src/constants'
import { AuthService } from '../auth.service'
import { UserEntity } from 'src/user/entities/user.entity'

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    ) {
        super()
    }

    serializeUser(user: UserEntity, done: Function) {
        console.log('Serializer User')
        done(null, user)
    }

    async deserializeUser(
        payload: { id: number },
        done: (err: Error | null, user: UserEntity | null) => void,
    ) {
        const user = await this.authService.findUser(payload.id)
        if (!user) {
            return done(null, null)
        }
        console.log('Deserialize User')
        console.log(user)
        return done(null, user)
    }
}
