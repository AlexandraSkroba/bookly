import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AUTH_SERVICE } from "src/constants";
import { AuthService } from "../auth.service";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: UserEntity, done: Function) {
        console.log('Serializer User');
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.id);
        console.log('Deserialize User');
        console.log(user);
        return user ? done(null, user) : done(null, null);
    }
}
