import { BasicEntity } from "src/database/entities/basic.entity";
import { RatingEntity } from "src/ratings/entities/rating.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";


@Entity('complains')
export class Complain extends BasicEntity {
  @OneToOne(() => RatingEntity, (rating) => rating.complain)
  @JoinColumn({ name: 'rating_id'})
  rating: RatingEntity;
}
