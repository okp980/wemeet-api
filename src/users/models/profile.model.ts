import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Profile extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  gender: string;

  @Column
  dateOfBirth: string;

  @Column(DataType.ARRAY(DataType.TEXT))
  passion: string[];

  @Column
  getNotifications: boolean;

  @Column
  email: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
