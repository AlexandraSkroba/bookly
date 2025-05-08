import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RecoverPasswordDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'maestro.prokrastinator@gmail.com' })
    email: string
}
