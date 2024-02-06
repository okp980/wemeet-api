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
  image: string;

  @Column
  name: string;

  @Column
  gender: string;

  @Column
  bio: string;

  @Column
  age: number;

  @Column(DataType.ARRAY(DataType.TEXT))
  passion: string[];

  @Column({ defaultValue: true })
  getNotifications: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
