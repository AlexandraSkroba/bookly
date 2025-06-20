import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookEntity } from './entities/book.entity'
import { BookRepository } from './book.repository'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { UserModule } from 'src/user/user.module'
import { GenreModule } from 'src/genre/genre.module'

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity]), UserModule, GenreModule],
    providers: [BookRepository, BookService],
    controllers: [BookController],
    exports: [BookService],
})
export class BookModule {}
