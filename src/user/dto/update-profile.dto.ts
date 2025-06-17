import { IsEmail, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProfileDto {
    @ApiPropertyOptional({
        type: 'string',
        description: 'Username',
    })
    @IsOptional()
    @IsString()
    username?: string

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Avatar image file',
    })
    @IsOptional()
    avatar?: any

    @ApiPropertyOptional({
        type: [Number],
        description: 'Array of preferred genre IDs',
        example: [1, 2],
    })
    preferenceGenreIds?: number[]

    @ApiPropertyOptional({
        type: 'string',
        format: 'email',
        description: 'User email',
    })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiPropertyOptional({
        type: 'string',
        description: 'City',
    })
    @IsOptional()
    @IsString()
    city?: string
}
