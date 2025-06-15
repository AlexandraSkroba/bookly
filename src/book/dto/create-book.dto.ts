import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'The Great Gatsby' })
    title: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'F. Scott Fitzgerald' })
    author: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Classic' })
    genre: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'English' })
    language: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Used' })
    condition: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New York' })
    location: string

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Book cover image file',
    })
    @IsOptional()
    cover?: any // Use 'any' for file uploads
}
