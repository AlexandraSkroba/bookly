/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    UseInterceptors,
    UploadedFile,
    Query,
    ParseArrayPipe,
    Param,
} from '@nestjs/common'
import { Request } from 'express'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOAuth2,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@ApiOAuth2(['bookly:write'])
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @UseInterceptors(
        FileInterceptor('cover', {
            storage: diskStorage({
                destination: './uploads/covers',
                filename: (
                    _req: Express.Request,
                    file: Express.Multer.File,
                    cb: (error: Error | null, filename: string) => void,
                ) => {
                    const ext = file.originalname.split('.').pop()
                    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`
                    cb(null, uniqueName)
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    @Post()
    async addBook(
        @Req() req: Request & { user: { userId: number } },
        @Body() dto: CreateBookDto,
        @Body('genreIds', new ParseArrayPipe({ items: Number, separator: ',' }))
        genreIds: number[],
        @UploadedFile() cover?: Express.Multer.File,
    ) {
        dto.genreIds = genreIds
        if (cover) {
            dto.cover = `/uploads/covers/${cover.filename}`
        }

        const book = await this.bookService.addBook(req.user.userId, dto)
        return { message: 'Book added', book }
    }

    @Get()
    async getCatalog() {
        return { books: await this.bookService.getCatalog() }
    }

    @Get(':id')
    async getBookDetails(@Param('id') id: number) {
        const book = await this.bookService.getBookById(id)
        if (!book) {
            return { message: 'Book not found' }
        }
        // Optionally, filter out sensitive owner fields
        const {
            password,
            passwordRecoveryToken,
            passwordRecoveryTokenExpires,
            ...owner
        } = book.owner || {}
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            genres: book.genres?.map((g) => g.name),
            language: book.language,
            condition: book.condition,
            location: book.location,
            description: book.description,
            cover: book.cover,
            owner: owner
                ? {
                      id: owner.id,
                      username: owner.username,
                      email: owner.email,
                      city: owner.city,
                      avatar: owner.avatar,
                  }
                : null,
        }
    }

    @Get('search')
    async searchBooks(@Query('q') q: string) {
        return this.bookService.searchBooks(q)
    }

    @Get('filter')
    async filterBooks(
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('genre') genre?: string | string[],
        @Query('language') language?: string,
        @Query('location') location?: string,
    ) {
        let genres: string[] | undefined
        if (Array.isArray(genre)) {
            genres = genre
        } else if (typeof genre === 'string') {
            genres = genre
                .split(',')
                .map((g) => g.trim())
                .filter(Boolean)
        }
        const books = await this.bookService.filterBooks({
            title,
            author,
            genres,
            language,
            location,
        })
        if (!books.length) {
            return { message: 'No books found', books: [] }
        }
        return { books }
    }

    @Get(':id/complete-description')
    @ApiOperation({ summary: 'Autocomplete book description using AI' })
    @ApiOkResponse({
        description: 'AI-generated description',
        schema: {
            example: {
                description:
                    'This is an AI-generated description for "Book Title" by Author.',
            },
        },
    })
    async completeDescription(@Param('id') id: number) {
        return this.bookService.completeDescription(id)
    }

    @Get(':id/complete-genres')
    @ApiOperation({ summary: 'Autocomplete book genres using AI' })
    @ApiOkResponse({
        description: 'AI-generated genres',
        schema: {
            example: {
                genres: ['Romance', 'Adventure'],
            },
        },
    })
    async completeGenres(@Param('id') id: number) {
        return this.bookService.completeGenres(id)
    }

    @Get('recommend')
    @ApiOperation({ summary: 'Get AI-powered book recommendations (mocked)' })
    @ApiOkResponse({
        description: 'Five recommended books',
        schema: {
            example: {
                books: [
                    { id: 1, title: 'Book 1', author: 'Author 1' /* ... */ },
                    // ...
                ],
            },
        },
    })
    async recommendBooks() {
        return this.bookService.recommendBooks()
    }
}
