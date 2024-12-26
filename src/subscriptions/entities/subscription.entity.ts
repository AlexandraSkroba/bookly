import { BasicEntity } from 'src/database/entities/basic.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('subscriptions')
export class Subscription extends BasicEntity {
  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'subscribed_id' })
  subscribed: UserEntity;
}
