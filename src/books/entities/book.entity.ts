import { UserEntity } from 'src/users/entities/user.entity';
import { BasicEntity } from '../../database/entities/basic.entity';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum BookCondition {
  new = 'new',
  used = 'used',
  damaged = 'damaged',
}

@Entity('books')
export class BookEntity extends BasicEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar' })
  genre: string;

  @Column({ type: 'varchar' })
  language: string;

  @Column({ type: 'enum', enum: BookCondition, default: BookCondition.new })
  condition: BookCondition;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  city: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
