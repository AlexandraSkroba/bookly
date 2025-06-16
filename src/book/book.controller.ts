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
} from '@nestjs/common'
import { Request } from 'express'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { ApiBearerAuth, ApiConsumes, ApiOAuth2 } from '@nestjs/swagger'
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

    @Get('search')
    async searchBooks(@Query('q') q: string) {
        return this.bookService.searchBooks(q)
    }
}
