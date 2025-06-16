import { Injectable, BadRequestException } from '@nestjs/common'
import { BookRepository } from './book.repository'
import { CreateBookDto } from './dto/create-book.dto'
import { UserService } from 'src/user/user.service'
import { GenreRepository } from 'src/genre/genre.repository'

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly genreRepository: GenreRepository,
        private readonly userService: UserService,
    ) {}

    async addBook(userId: number, dto: CreateBookDto) {
        const user = await this.userService.findById(userId)
        if (!user) throw new BadRequestException('User not found')
        const genres = await this.genreRepository.findByIds(dto.genreIds)
        if (genres.length !== dto.genreIds.length)
            throw new BadRequestException('Some genres not found')
        return this.bookRepository.createAndSave({
            ...dto,
            genres,
            owner: user,
        })
    }

    async getCatalog() {
        return this.bookRepository.findAll()
    }

    async getBookById(id: number) {
        const book = await this.bookRepository.findById(id)
        if (!book) throw new BadRequestException('Book not found')
        return book
    }

    async getBooksByUserId(userId: number) {
        const user = await this.userService.findById(userId)
        if (!user) throw new BadRequestException('User not found')
        return this.bookRepository.findByOwnerId(user.id)
    }

    async searchBooks(keyword: string) {
        const books = await this.bookRepository.searchBooks(keyword)
        if (!books.length) {
            return { message: 'No books found', books: [] }
        }
        return { books }
    }

    async filterBooks(query: {
        title?: string
        author?: string
        genres?: string[]
        language?: string
        location?: string
    }) {
        return this.bookRepository.filterBooks(query)
    }

    async deleteBook(id: number, userId: number) {
        const book = await this.getBookById(id)
        if (book.owner.id !== userId) {
            throw new BadRequestException(
                'You do not have permission to delete this book',
            )
        }
        return this.bookRepository.delete(id)
    }

    async updateBook(id: number, userId: number, dto: CreateBookDto) {
        const book = await this.getBookById(id)
        if (book.owner.id !== userId) {
            throw new BadRequestException(
                'You do not have permission to update this book',
            )
        }
        return this.bookRepository.update(id, dto)
    }
}
