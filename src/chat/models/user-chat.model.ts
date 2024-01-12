import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Chat } from './chat.model';

@Table
export class UserChat extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;
}
