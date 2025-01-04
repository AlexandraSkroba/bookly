export class ExchangeOfferedEvent {
  constructor(
    public readonly userId: number,
    public readonly username: string,
    public readonly bookId: number,
    public readonly bookTitle: string,
    public readonly exchangeId: number,
  ) {}
}
