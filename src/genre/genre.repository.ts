import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { GenreEntity } from './entities/genre.entity'

@Injectable()
export class GenreRepository {
    constructor(
        @InjectRepository(GenreEntity)
        private readonly repo: Repository<GenreEntity>,
    ) {}

    async findByIds(ids: number[]): Promise<GenreEntity[]> {
        return this.repo.findBy({ id: In(ids) })
    }
}
