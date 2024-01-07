import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MeetRequestCreatedEvent } from '../events/meet-request.created.event';
import admin from 'firebase-admin';
import { UsersService } from 'src/users/users.service';
import { MeetRequestUpdatedEvent } from '../events/meet-request.updated.event';

admin.initializeApp({
  credential: admin.credential.cert(
    require('../../../wemeet-firebase-adminsdk.json'),
  ),
});

@Injectable()
export class MeetListener {
  constructor(private usersService: UsersService) {}

  @OnEvent('meet.created', { async: true })
  async handleMeetRequestCreatedEvent({
    recipient,
    creator,
  }: MeetRequestCreatedEvent) {
    const reciever = await this.usersService.findOne(recipient);
    const sender = await this.usersService.findOne(creator);
    await admin.messaging().send({
      token: reciever.fcmToken,
      notification: {
        title: 'New Meet',
        body: `${sender?.profile?.firstName} sent a request`,
      },
      data: {
        type: 'MATCH_SCREEN',
        payload: JSON.stringify({
          sender: creator,
        }),
      },
    });
  }

  @OnEvent('meet.updated', { async: true })
  async handleMeetRequestUpdatedEvent({
    recipient,
    creator,
  }: MeetRequestUpdatedEvent) {
    const reciever = await this.usersService.findOne(recipient);
    const sender = await this.usersService.findOne(creator);
    await admin.messaging().send({
      token: sender.fcmToken,
      notification: {
        title: 'Meet Accepted',
        body: `${reciever?.profile?.firstName} has accepted your request`,
      },
      data: {
        type: 'MATCH_SCREEN',
        payload: JSON.stringify({
          recipient,
        }),
      },
    });
  }
}
