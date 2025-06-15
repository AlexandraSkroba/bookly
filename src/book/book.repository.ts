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
        return this.repo.find({ relations: ['owner'] })
    }

    async findById(id: number): Promise<BookEntity | null> {
        return this.repo.findOne({ where: { id }, relations: ['owner'] })
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
