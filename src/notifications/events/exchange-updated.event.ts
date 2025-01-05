export class ExchangeUpdatedEvent {
  constructor(
    public readonly bookTitle: string,
    public readonly userId: number,
  ) {}
}
