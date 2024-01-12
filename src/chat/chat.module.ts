import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { UserChat } from './models/user-chat.model';

@Module({
  imports: [SequelizeModule.forFeature([Chat, UserChat])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
