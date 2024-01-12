import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
