export class MeetRequestCreatedEvent {
  creator: number;
  recipient: number;
  constructor(creator: number, recipient: number) {
    this.creator = creator;
    this.recipient = recipient;
  }
}
