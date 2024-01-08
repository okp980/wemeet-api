import {
  Column,
  ForeignKey,
  Model,
  Table,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table
export class MeetRequest extends Model {
  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User, { foreignKey: 'creatorId', as: 'creator' })
  creator: User;

  @ForeignKey(() => User)
  @Column
  recipientId: number;

  @BelongsTo(() => User, { foreignKey: 'recipientId', as: 'recipient' })
  recipient: User;

  @Column({
    defaultValue: 'pending',
    type: DataType.ENUM('pending', 'rejected', 'accepted'),
  })
  status: string;
}
