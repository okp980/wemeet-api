export class MeetRequestUpdatedEvent {
  creator: number;
  recipient: number;
  constructor(creator: number, recipient: number) {
    this.creator = creator;
    this.recipient = recipient;
  }
}
