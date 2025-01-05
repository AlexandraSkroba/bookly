import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';

@Entity('dialogs')
export class Dialog extends BasicEntity {
  @OneToMany(() => ExchangeEntity, (exchange) => exchange.dialog)
  subjects: ExchangeEntity[];

  @ManyToMany(() => UserEntity, (user) => user.dialogs)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => Message, (message) => message.dialog)
  messages: Message[];
}
