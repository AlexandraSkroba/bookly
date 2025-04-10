import { Module } from "@nestjs/common";
import { AUTH_SERVICE } from "src/constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserEntity } from "src/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { GoogleStrategy } from "./utils/google.strategy";
import { SessionSerializer } from "./utils/serializer";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
    controllers: [AuthController],
    providers: [
        GoogleStrategy,
        SessionSerializer,
        {
            provide: AUTH_SERVICE,
            useClass: AuthService
        }
    ],
    exports: [AUTH_SERVICE]
})
export class AuthModule { }
