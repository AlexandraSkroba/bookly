import { INestApplication, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BooksService } from '../src/books/books.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';

jest.mock('../src/auth/auth.middleware', () => ({
  AuthMiddleware: (_, __, next) => next(),
}));

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  const booksService = {
    findAll: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BooksService)
      .useValue(booksService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/books (GET) - index', async () => {
    booksService.findAll.mockResolvedValue([{ id: 1, title: 'Book 1' }]);

    const response = await request(app.getHttpServer())
      .get('/books?page=1&limit=10')
      .expect(200);

    expect(response.body).toEqual([{ id: 1, title: 'Book 1' }]);
    expect(booksService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('/books/search (POST) - search', async () => {
    const filterParams = { title: 'Book' };
    booksService.search.mockResolvedValue([{ id: 2, title: 'Book 2' }]);

    const response = await request(app.getHttpServer())
      .post('/books/search?page=1&limit=10')
      .send(filterParams)
      .expect(201);

    expect(response.body).toEqual([{ id: 2, title: 'Book 2' }]);
    expect(booksService.search).toHaveBeenCalledWith(filterParams, 1, 10);
  });

  it('/books (POST) - create', async () => {
    const bookParams = { title: 'New Book', author: 'Author' };
    booksService.create.mockResolvedValue({ id: 3, ...bookParams });

    const response = await request(app.getHttpServer())
      .post('/books')
      .send(bookParams)
      .expect(201);

    expect(response.body).toEqual({ id: 3, ...bookParams });
    expect(booksService.create).toHaveBeenCalledWith(bookParams, undefined); // Mock req.currentUser as undefined
  });

  it('/books/:id (PUT) - update', async () => {
    const bookParams = { title: 'Updated Book', author: 'New Author' };
    booksService.update.mockResolvedValue({ id: 4, ...bookParams });

    const response = await request(app.getHttpServer())
      .put('/books/4')
      .send(bookParams)
      .expect(200);

    expect(response.body).toEqual({ id: 4, ...bookParams });
    expect(booksService.update).toHaveBeenCalledWith("4", bookParams, undefined);
  });

  it('/books/:id (DELETE) - destroy', async () => {
    booksService.delete.mockResolvedValue({ message: 'Book deleted' });

    const response = await request(app.getHttpServer())
      .delete('/books/6')
      .expect(200);

    expect(response.body).toEqual({ message: 'Book deleted' });
    expect(booksService.delete).toHaveBeenCalledWith("6", undefined);
  });
});
