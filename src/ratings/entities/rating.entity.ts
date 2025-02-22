import { Complain } from 'src/complains/entities/complain.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum RatingTarget {
  'exchange' = 'exchange',
  'book' = 'book',
}

@Entity('ratings')
export class RatingEntity extends BasicEntity {
  @Column()
  text: string;

  @Column({ type: 'integer' })
  rate: number;

  @ManyToOne(() => UserEntity, (user) => user.ratings)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @Column({ type: 'enum', enum: RatingTarget, default: RatingTarget.exchange })
  targetType: RatingTarget;

  @Column({ type: 'integer' })
  targetId: number;

  @OneToOne(() => Complain, (complain) => complain.rating, { nullable: true })
  @JoinColumn({ name: 'complain_id' })
  complain: Complain;
}
