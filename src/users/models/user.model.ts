import { Column, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from './profile.model';

@Table
export class User extends Model {
  @Column
  email: string;

  @HasOne(() => Profile)
  profile: Profile;

  @Column
  provider: string;

  @Column({ defaultValue: 'bio-data' })
  onboardStatus: string;
}
