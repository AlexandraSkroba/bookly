import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator'
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
        type: [String],
        description: 'User preferences (genres, authors, etc.)',
        example: ['fiction', 'fantasy'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    preferences?: string[]

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
