import { Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from './profile.model';
import { Meet } from 'src/meet-request/models/meet.model';

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

  @HasMany(() => Meet, { foreignKey: 'creatorId', as: 'sentRequests' })
  sentRequests: Meet[];

  @HasMany(() => Meet, { foreignKey: 'recipientId', as: 'recievedRequests' })
  recievedRequests: Meet[];
}
