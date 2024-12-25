import { BasicEntity } from "src/database/entities/basic.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";


@Entity('notifications')
export class Notification extends BasicEntity {
  @Column()
  text: string;

  @ManyToMany(() => UserEntity, (user) => user.notifications)
  @JoinTable()
  users: UserEntity[];
}
