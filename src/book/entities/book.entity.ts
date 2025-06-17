import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinTable,
    ManyToMany,
} from 'typeorm'
import { UserEntity } from 'src/user/entities/user.entity'
import { GenreEntity } from 'src/genre/entities/genre.entity'

@Entity('books')
export class BookEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    author: string

    @Column({ nullable: true })
    description?: string

    @ManyToMany(() => GenreEntity, (genre) => genre.books, { eager: true })
    @JoinTable()
    genres: GenreEntity[]

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
