import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BookEntity } from './entities/book.entity'

@Injectable()
export class BookRepository {
    constructor(
        @InjectRepository(BookEntity)
        private readonly repo: Repository<BookEntity>,
    ) {}

    async createAndSave(book: Partial<BookEntity>): Promise<BookEntity> {
        const newBook = this.repo.create(book)
        return this.repo.save(newBook)
    }

    async findAll(): Promise<BookEntity[]> {
        return this.repo.find({ relations: ['owner', 'genres'] })
    }

    async findById(id: number): Promise<BookEntity | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['owner', 'genres'],
        })
    }

    async searchBooks(keyword: string): Promise<BookEntity[]> {
        if (!keyword) {
            return this.repo.find({ relations: ['owner', 'genres'] })
        }
        return this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndSelect('book.genres', 'genre')
            .where('book.title ILIKE :kw', { kw: `%${keyword}%` })
            .orWhere('book.author ILIKE :kw', { kw: `%${keyword}%` })
            .orWhere('book.language ILIKE :kw', { kw: `%${keyword}%` })
            .orWhere('book.location ILIKE :kw', { kw: `%${keyword}%` })
            .orWhere('genre.name ILIKE :kw', { kw: `%${keyword}%` })
            .getMany()
    }

    async filterBooks(query: {
        title?: string
        author?: string
        genres?: string[]
        language?: string
        location?: string
    }): Promise<BookEntity[]> {
        const qb = this.repo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.owner', 'owner')
            .leftJoinAndSelect('book.genres', 'genre')

        if (query.title) {
            qb.andWhere('book.title ILIKE :title', {
                title: `%${query.title}%`,
            })
        }
        if (query.author) {
            qb.andWhere('book.author ILIKE :author', {
                author: `%${query.author}%`,
            })
        }
        if (query.language) {
            qb.andWhere('book.language ILIKE :language', {
                language: `%${query.language}%`,
            })
        }
        if (query.location) {
            qb.andWhere('book.location ILIKE :location', {
                location: `%${query.location}%`,
            })
        }
        if (query.genres && query.genres.length > 0) {
            qb.andWhere('genre.name IN (:...genres)', { genres: query.genres })
        }

        return qb.getMany()
    }

    async update(
        id: number,
        book: Partial<BookEntity>,
    ): Promise<BookEntity | null> {
        await this.repo.update(id, book)
        return this.findById(id)
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id)
    }

    async findByOwnerId(ownerId: number): Promise<BookEntity[]> {
        return this.repo.find({
            where: { owner: { id: ownerId } },
            relations: ['owner'],
        })
    }
}
