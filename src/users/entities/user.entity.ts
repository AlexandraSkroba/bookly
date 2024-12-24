import * as bcrypt from 'bcrypt';
import { BasicEntity } from '../../database/entities/basic.entity';
import { Column, Entity, Index, BeforeInsert, OneToMany } from 'typeorm';
import { v4 } from 'uuid';
import { BookEntity } from 'src/books/entities/book.entity';
import { Exclude, classToPlain } from 'class-transformer';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';

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

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  resetPasswordToken: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @OneToMany(() => BookEntity, (book) => book.owner)
  books: BookEntity[];

  @OneToMany(() => ExchangeEntity, (exchange) => exchange.from)
  outcomingExchanges: ExchangeEntity[];

  @OneToMany(() => ExchangeEntity, (exchange) => exchange.to)
  incomingExchanges: ExchangeEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.owner)
  ratings: RatingEntity[];

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async generateConfirmationToken() {
    this.confirmationToken = await v4();
  }

  async generateResetPasswordToken() {
    this.resetPasswordToken = await v4();
    return this.resetPasswordToken;
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
