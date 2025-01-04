import { BookAddedEvent } from 'src/notifications/events/book-added.event';
import { NotificationsService } from './notifications.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { NotificationsGateway } from './notifications.gateway';
import { ExchangeOfferedEvent } from './events/exchange-offered.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsListener {
  constructor(
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
    private usersService: UsersService,
    private booksService: BooksService,
  ) {}
  @OnEvent('book.added', { async: true })
  async handleBookAddedEvent(event: BookAddedEvent) {
    const { userId, bookId } = event;

    const user = await this.usersService.findOne({ where: { id: userId } });
    const book = await this.booksService.retrieveOne({ where: { id: bookId } });

    const text = `${user.username} just added a new book: ${book.author}, ${book.title}`;
    const subject = 'New book created';
    const notification = await this.notificationsService.create(text, [userId]);
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }

  @OnEvent('exchange.offered', { async: true })
  async handleExchangeOfferedEvent(event: ExchangeOfferedEvent) {
    const { userId, username, bookId, bookTitle, exchangeId } = event;

    const text = `<a href="/users/${userId}">${username}</a> offered you <a href="/exchanges/${exchangeId}/edit">exchange</a> <a href="/books/${bookId}/edit">${bookTitle}</a>`;
    const subject = 'New exchange offered';
    const notification = await this.notificationsService.create(text, [userId]);
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }
}
