import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { GetMessagesDto } from './dto/get-messages.dto';
import { ChatService } from 'src/chat/chat.service';
import { Profile } from 'src/users/models/profile.model';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private chatService: ChatService,
    private usersService: UsersService,
  ) {}
  async create({ content, chatId, userId }: any) {
    const user = await this.usersService.findById(userId);
    const chat = await this.chatService.getChat(chatId);
    const message = await user.$create('message', { content });
    await chat.$add('message', message);

    return await this.messageModel.findByPk(message.id, {
      include: { all: true, nested: true },
    });
  }

  async getChatMessages({
    userId,
    friendId,
    page,
  }: GetMessagesDto & { userId: number }) {
    const chat = await this.chatService.getChatFromUsers({ userId, friendId });
    if (!chat) return [];
    return await chat.$get('messages', {
      limit: 10,
      include: { all: true, nested: true },
      order: [['createdAt', 'DESC']],
    });
    // return await this.messageModel.findAll({
    //   where: { chatId },
    //   limit: 10,
    // });
  }

  typing() {
    return `This action returns all message`;
  }
}
