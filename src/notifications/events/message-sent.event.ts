export class MessageSentEvent {
  constructor(
    public readonly senderId: number,
    public readonly senderName: number,
    public readonly receiverIds: number[],
    public readonly dialogId: number,
  ) {}
}
