import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Dialog } from '../../dialogs/entities/dialog.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('messages')
export class Message extends BasicEntity {
  @ManyToOne(() => Dialog, (dialog) => dialog.messages)
  @JoinColumn({ name: 'dialog_id' })
  dialog: Dialog;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
