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

    async completeDescription(id: number): Promise<{ description: string }> {
        const book = await this.getBookById(id)
        if (!book) throw new BadRequestException('Book not found')
        // Mock AI call with timeout
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // In real implementation, call AI API here with book data
        return {
            description: `"The Great Gatsby" is a classic novel written by F. Scott Fitzgerald, set in the roaring twenties in the United States. The story is narrated by Nick Carraway, a Midwesterner who moves to Long Island's North Shore and becomes caught up in the tantalizing world of the wealthy.
                At the center of this world is the mysterious and enigmatic Jay Gatsby, a millionaire known for his lavish parties, yet shrouded in mystery regarding his past. Gatsby, who dreams of reuniting with his former love, Daisy Buchanan, wife of the philandering Tom Buchanan, pursues Nick to help him win Daisy back.
                As the story unfolds, the seemingly idyllic lives of Daisy, Tom, and Gatsby are exposed as shallow, morally bankrupt, and filled with deceit, disillusionment, and tragedy. The novel is a poignant commentary on the American Dream, the decadence and materialism of 1920s society, and the concept of illusion versus reality.
                "The Great Gatsby" is a novel that continues to be widely read and studied for its exploration of the human condition, its rich prose, and its enduring themes of hope, disillusionment, and the pursuit of the elusive American Dream.`,
        }
    }

    async completeGenres(id: number): Promise<{ genres: string[] }> {
        const book = await this.getBookById(id)
        if (!book) throw new BadRequestException('Book not found')
        // Mock AI call with timeout
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // In real implementation, call AI API here with book data
        return {
            genres: ['Tragedy'],
        }
    }

    async recommendBooks(): Promise<{ books: any[] }> {
        // Simulate AI delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // Get 5 random books (or first 5 if you want it simple)
        const allBooks = await this.bookRepository.findAll()
        // Shuffle and pick 5, or just slice first 5
        const books = allBooks./*sort(() => 0.5 - Math.random()).*/ slice(0, 5)
        return { books }
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
