import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 320 })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    password: string | null;
}
