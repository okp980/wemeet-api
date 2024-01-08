import { Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from './profile.model';
import { MeetRequest } from 'src/meet-request/models/meet-request.model';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  provider: string;

  @Column
  fcmToken: string;

  @HasOne(() => Profile)
  profile: Profile;

  @HasMany(() => MeetRequest, { foreignKey: 'creatorId', as: 'sentRequests' })
  sentRequests: MeetRequest[];

  @HasMany(() => MeetRequest, {
    foreignKey: 'recipientId',
    as: 'recievedRequests',
  })
  recievedRequests: MeetRequest[];
}
