import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { Op } from 'sequelize';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from 'src/message/models/message.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { UserChat } from './models/user-chat.model';
import { Profile } from 'src/users/models/profile.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat)
    private chatModel: typeof Chat,
    @InjectModel(Message)
    private messageModel: typeof Message,
    private sequelize: Sequelize,
  ) {}
  async getChat(id: number) {
    return await this.chatModel.findByPk(id, { include: User });
  }
  async getUserChats(userId: number) {
    const chats = await this.chatModel.findAll({
      include: [
        {
          model: User,
          through: { where: { userId }, attributes: [] },
          include: [
            {
              model: Profile,
            },
          ],
        },
        {
          model: Message,
          limit: 1,
        },
      ],
    });

    const chatsWithRecipient = chats.map((chat) => {
      const { id, users, messages, createdAt, updatedAt } = chat;

      return {
        id,
        recipient: users.find((user) => user.id !== userId),
        messages,
        createdAt,
        updatedAt,
      };
    });

    return chatsWithRecipient;
  }

  async createChat(createChatDto: CreateChatDto) {
    const { messageContent, userId, friendId } = createChatDto;
    // TODO: right implementation to get a chat with 2 users
    const chat = await this.chatModel.findOne({
      include: [
        {
          model: User,
          where: {
            id: { [Op.in]: [userId, friendId] },
          },
          required: true,
        },
      ],
    });
    if (chat) return chat;
    return await this.sequelize.transaction(async (transaction) => {
      console.log('userId: ' + userId, 'friendId: ' + friendId);
      const message = await this.messageModel.create(
        {
          content: messageContent,
          userId,
        },
        { transaction },
      );

      const chat = await this.chatModel.create({}, { transaction });
      await chat.$add('users', [userId, friendId], { transaction });
      await chat.$add('message', message, { transaction });
      await message.$set('chat', chat, { transaction });
      return chat;
    });
  }
}
