import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class CreateUserDto {
@IsNotEmpty({ message: 'Email is required' })
    @IsOptional()
    @ApiPropertyOptional({ example: 'maestro.prokrastinator@gmail.com' })
    username?: string

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'maestro.prokrastinator@gmail.com' })
    email: string

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: 'password' })
    password: string
}
