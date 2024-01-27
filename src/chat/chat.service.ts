import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { Op } from 'sequelize';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from 'src/message/models/message.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Profile } from 'src/users/models/profile.model';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
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
  async getChatFromUsers({
    userId,
    friendId,
  }: {
    userId: number;
    friendId: number;
  }) {
    return await this.chatModel.findOne({
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
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    return await Promise.all(
      chats.map(async (chat) => {
        const { id, messages, createdAt, updatedAt } = chat;

        const users = await chat.$get('users', {
          include: [{ all: true, nested: true }],
        });

        return {
          id,
          recipient: users?.find((user) => user.id !== userId),
          messages,
          createdAt,
          updatedAt,
        };
      }),
    );
  }

  async createChat({ friendId, userId }: CreateChatDto) {
    const chat = await this.chatModel.create({});
    await chat.$add('users', [userId, friendId]);
    return await chat.save();
  }
}
