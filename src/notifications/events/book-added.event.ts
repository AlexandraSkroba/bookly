export class BookAddedEvent {
  constructor(public readonly userId: number, public readonly bookId: number) {}
}
