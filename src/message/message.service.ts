import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { GetMessagesDto } from './dto/get-messages.dto';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message) private messageModel: typeof Message) {}
  async create(createMessageDto: any) {
    return await this.messageModel.create(createMessageDto);
  }

  async getChatMessages({ chatId, page }: GetMessagesDto) {
    return await this.messageModel.findAll({
      where: { chatId },
      limit: 10,
    });
  }

  typing() {
    return `This action returns all message`;
  }
}
