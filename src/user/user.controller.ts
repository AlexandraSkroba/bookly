/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    Put,
    Body,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    ParseFilePipeBuilder,
    Get,
} from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UserService } from './user.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { ApiBearerAuth, ApiConsumes, ApiOAuth2 } from '@nestjs/swagger'

interface AuthenticatedRequest extends Request {
    user: {
        userId: number
        email: string
    }
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOAuth2(['bookly:write'])
    @Get('profile')
    async getProfile(@Req() req: AuthenticatedRequest) {
        const user = await this.userService.findById(req.user.userId)
        if (!user) {
            return { message: 'User not found' }
        }
        // Optionally, filter out sensitive fields like password
        const {
            password,
            passwordRecoveryToken,
            passwordRecoveryTokenExpires,
            isEmailConfirmed,
            ...safeUser
        } = user
        return { user: safeUser }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOAuth2(['bookly:write'])
    @Put('profile')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (
                    _req: Express.Request,
                    file: Express.Multer.File,
                    cb: (error: Error | null, filename: string) => void,
                ) => {
                    const uniqueName = `${Date.now()}-${file.originalname}`
                    cb(null, uniqueName)
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateProfileDto,

        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: 10000000, // 10 MB
                })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        avatar?: Express.Multer.File,
    ) {
        if (avatar) {
            dto.avatar = `/uploads/avatars/${avatar.filename}`
        }
        const user = await this.userService.updateProfile(req.user.userId, dto)
        return { message: 'Profile updated', user }
    }
}
