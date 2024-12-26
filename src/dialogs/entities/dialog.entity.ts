import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';

@Entity('dialogs')
export class Dialog extends BasicEntity {
  @OneToOne(() => ExchangeEntity, (exchange) => exchange.dialog)
  subject: ExchangeEntity;

  @ManyToMany(() => UserEntity, (user) => user.dialogs)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => Message, (message) => message.dialog)
  messages: Message[];
}
