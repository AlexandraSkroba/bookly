import * as bcrypt from 'bcrypt';
import { BasicEntity } from '../../database/entities/basic.entity';
import { Column, Entity, Index, BeforeInsert } from 'typeorm';

@Entity('users')
export class UserEntity extends BasicEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  setUsername() {
    if (!this.username) {
      this.username = this.email.split('@')[0];
    }
  }
}