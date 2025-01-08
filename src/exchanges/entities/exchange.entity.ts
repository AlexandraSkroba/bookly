import { BookEntity } from 'src/books/entities/book.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum ExchangeState {
  preparation = 'preparation',
  approved = 'approved',
  declined = 'declined',
  completed = 'completed',
}

@Entity('exchanges')
@Index('idx_from_to_book', ['from', 'to', 'book'])
export class ExchangeEntity extends BasicEntity {
  @ManyToOne(() => UserEntity, (user) => user.outcomingExchanges)
  @JoinColumn({ name: 'from_id' })
  from: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.incomingExchanges)
  @JoinColumn({ name: 'to_id' })
  to: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.exchanges)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @Column({
    type: 'enum',
    enum: ExchangeState,
    default: ExchangeState.preparation,
  })
  state: ExchangeState;

  @Column({ type: 'date', nullable: true })
  acceptedDate: Date;

  @Column({ type: 'date', nullable: true })
  declinedDate: Date;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @ManyToOne(() => Dialog, (dialog) => dialog.subjects)
  @JoinColumn({ name: 'dialog_id' })
  dialog: Dialog;
}
