import { UserEntity } from 'src/users/entities/user.entity';
import { BasicEntity } from '../../database/entities/basic.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';

export enum BookCondition {
  new = 'new',
  used = 'used',
  damaged = 'damaged',
}

export enum BookExchangeState {
  'available' = 'available',
  'requested' = 'requested',
  'in exchange' = 'in exchange',
  'exchanged' = 'exchanged',
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

  @Column({
    type: 'enum',
    enum: BookExchangeState,
    default: BookExchangeState.available,
  })
  exchangeState: BookExchangeState;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;

  @ManyToOne(() => ExchangeEntity, (exchange) => exchange.book)
  exchanges: ExchangeEntity;
}
