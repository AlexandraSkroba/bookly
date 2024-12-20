import * as bcrypt from 'bcrypt';
import { BasicEntity } from '../../database/entities/basic.entity';
import { Column, Entity, Index, BeforeInsert, OneToMany } from 'typeorm';
import { v4 } from 'uuid';
import { BookEntity } from 'src/books/entities/book.entity';
import { Exclude, classToPlain } from 'class-transformer';

@Entity('users')
export class UserEntity extends BasicEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  @Exclude({ toPlainOnly: true })
  isConfirmed: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  confirmationToken: string;

  @OneToMany(() => BookEntity, (book) => book.user)
  books: BookEntity[];

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async generateConfirmationToken() {
    this.confirmationToken = await v4();
  }

  @BeforeInsert()
  setUsername() {
    if (!this.username) {
      this.username = this.email.split('@')[0].slice(0, 15);
    }
  }

  toJSON() {
    return classToPlain(this);
  }
}
