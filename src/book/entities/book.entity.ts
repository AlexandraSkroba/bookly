import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { UserEntity } from 'src/user/entities/user.entity'

@Entity('books')
export class BookEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    author: string

    @Column()
    genre: string

    @Column()
    language: string

    @Column()
    condition: string // e.g. 'new', 'used'

    @Column()
    location: string // e.g. 'New York, USA'

    @Column({ type: 'varchar', nullable: true })
    cover: string | null

    @ManyToOne(() => UserEntity, (user) => user.books)
    owner: UserEntity
}
