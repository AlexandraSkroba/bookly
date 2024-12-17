import { BadRequestException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends UserDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 15 })
  userName: string;

  @BeforeInsert()
  validateAndSetDefaultUserName() {
    if (!this.isValidEmail(this.email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (!this.userName) {
      this.userName = this.email.split('@')[0];
    }
  }

  // Метод для проверки корректности email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }
}
