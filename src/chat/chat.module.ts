import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { UserChat } from './models/user-chat.model';
import { MessageModule } from 'src/message/message.module';
import { Message } from 'src/message/models/message.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Chat, UserChat]),
    forwardRef(() => MessageModule),
  ],
  providers: [ChatService],
  exports: [ChatService, SequelizeModule],
})
export class ChatModule {}
