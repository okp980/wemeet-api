import {
  BelongsToMany,
  Column,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';
import { MeetRequest } from 'src/meet-request/models/meet-request.model';
import { Chat } from 'src/chat/models/chat.model';
import { UserChat } from 'src/chat/models/user-chat.model';
import { Message } from 'src/message/models/message.model';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  provider: string;

  @Column
  fcmToken: string;

  @Column
  socketId: string;

  @HasOne(() => Profile)
  profile: Profile;

  @HasMany(() => MeetRequest, { foreignKey: 'creatorId', as: 'sentRequests' })
  sentRequests: MeetRequest[];

  @HasMany(() => MeetRequest, {
    foreignKey: 'recipientId',
    as: 'recievedRequests',
  })
  recievedRequests: MeetRequest[];

  @BelongsToMany(() => Chat, () => UserChat)
  chats: Chat[];

  @HasMany(() => Message)
  messages: Message[];
}
