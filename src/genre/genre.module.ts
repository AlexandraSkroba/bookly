import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GenreEntity } from './entities/genre.entity'
import { GenreRepository } from './genre.repository'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'

@Module({
    imports: [TypeOrmModule.forFeature([GenreEntity])],
    providers: [GenreRepository, GenreService],
    controllers: [GenreController],
    exports: [GenreService, GenreRepository],
})
export class GenreModule {}
