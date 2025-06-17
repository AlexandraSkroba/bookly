import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { BookEntity } from 'src/book/entities/book.entity'
import { UserEntity } from 'src/user/entities/user.entity'

@Entity('genres')
export class GenreEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @ManyToMany(() => UserEntity, (user) => user.preferences)
    users: UserEntity[]

    @ManyToMany(() => BookEntity, (book) => book.genres)
    books: BookEntity[]
}
