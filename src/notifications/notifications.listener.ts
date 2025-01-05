import { BookAddedEvent } from 'src/notifications/events/book-added.event';
import { NotificationsService } from './notifications.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { NotificationsGateway } from './notifications.gateway';
import { ExchangeOfferedEvent } from './events/exchange-offered.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ExchangeUpdatedEvent } from './events/exchange-updated.event';
import { MessageSentEvent } from './events/message-sent.event';

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
    const { toUserId, fromUserId, username, bookId, bookTitle, exchangeId } =
      event;

    const text = `<a href="/users/${toUserId}">${username}</a> offered you <a href="/exchanges/${exchangeId}/edit"> to exchange</a> <a className="notification-book__link" href="/books/${bookId}/edit">${bookTitle}</a>`;
    const subject = 'New exchange offered';
    const notification = await this.notificationsService.create(text, [
      fromUserId,
    ]);
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }

  @OnEvent('exchange.updated', { async: true })
  async handleExchangeUpdatedEvent(event: ExchangeUpdatedEvent) {
    const { bookTitle, userId } = event;

    const text = `${bookTitle} exchange state updated.`;
    const notification = await this.notificationsService.create(text, [userId]);
    const subject = 'Exchange updated';
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }

  @OnEvent('message.sent', { async: true })
  async handleMessageSentEvent(event: MessageSentEvent) {
    const { senderId, senderName, receiverIds, dialogId } = event;

    const text = `<a href="/users/${senderId}">${senderName}</a> just messaged you. <a href="/dialogs/${dialogId}">View</a>`;
    const notification = await this.notificationsService.create(
      text,
      receiverIds,
    );
    const subject = `New message from ${senderName}`;
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }
}
