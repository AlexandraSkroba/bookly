export class MessageSentEvent {
  constructor(
    public readonly senderId: number,
    public readonly senderName: string,
    public readonly receiverIds: number[],
    public readonly dialogId: number,
  ) {}
}
