export class ExchangeOfferedEvent {
  constructor(
    public readonly toUserId: number,
    public readonly fromUserId: number,
    public readonly username: string,
    public readonly bookId: number,
    public readonly bookTitle: string,
    public readonly exchangeId: number,
  ) {}
}
