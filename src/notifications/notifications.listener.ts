import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { BookAddedEvent } from "src/notifications/events/book-added.event";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "src/users/users.service";
import { BooksService } from "src/books/books.service";
import { NotificationsGateway } from "./notifications.gateway";


@EventsHandler(BookAddedEvent)
export class BookAddedEventHandler implements IEventHandler<BookAddedEvent> {
  constructor(private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
    private usersService: UsersService,
    private booksService: BooksService,
  ) {}

  async handle(event: BookAddedEvent) {
    const { userId, bookId } = event;
    
    const user = await this.usersService.findOne({ where: { id: userId } });
    const book = await this.booksService.retrieveOne({ where: { id: bookId } });
  
    const text = `${user.username} just added a new book: ${book.author}, ${book.title}`;
    const subject = 'New book created';
    const notification = await this.notificationsService.create(text, [userId])
    await this.notificationsGateway.sendNotification(notification.id, subject);
  }
}
