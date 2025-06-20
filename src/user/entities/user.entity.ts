import { BookEntity } from 'src/book/entities/book.entity'
import { GenreEntity } from 'src/genre/entities/genre.entity'
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
    @OneToMany(() => BookEntity, (book) => book.owner)
    books: BookEntity[]

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 320 })
    username: string

    @Column({ type: 'varchar', length: 320 })
    email: string

    @Column({ type: 'varchar', length: 50 })
    city: string

    @Column({ default: false })
    public isEmailConfirmed: boolean

    @Column({ type: 'varchar', nullable: true })
    password: string | null

    @Column({ type: 'varchar', nullable: true })
    passwordRecoveryToken: string | null // Token for password recovery

    @Column({ type: 'timestamp', nullable: true })
    passwordRecoveryTokenExpires: Date | null // Expiration time for the token

    @Column({ type: 'varchar', nullable: true })
    avatar: string | null

    @ManyToMany(() => GenreEntity, (genre) => genre.users, { eager: true })
    @JoinTable()
    preferences: GenreEntity[]
}
