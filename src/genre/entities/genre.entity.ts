import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { BookEntity } from 'src/book/entities/book.entity'

@Entity('genres')
export class GenreEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @ManyToMany(() => BookEntity, (book) => book.genres)
    books: BookEntity[]
}
