import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import { AuthService } from '../auth.service'
import { AUTH_SERVICE } from 'src/constants'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: AuthService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID')
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET')
        const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL')

        if (!clientID) throw new Error('GOOGLE_CLIENT_ID is not defined in env')
        if (!clientSecret)
            throw new Error('GOOGLE_CLIENT_SECRET is not defined in env')
        if (!callbackURL)
            throw new Error('GOOGLE_CALLBACK_URL is not defined in env')

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['profile', 'email'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile)

        const email = profile.emails?.[0]?.value
        if (!email) {
            throw new Error('Google account does not have an email')
        }
        const user = await this.authService.validateUser({ email })
        console.log('Validate')
        console.log(user)
        return user || null
    }
}
