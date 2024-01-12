import { BelongsToMany, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { UserChat } from './user-chat.model';
import { Message } from 'src/message/models/message.model';

@Table
export class Chat extends Model {
  @BelongsToMany(() => User, () => UserChat)
  user: User[];

  @HasMany(() => Message)
  messages: Message[];
}
