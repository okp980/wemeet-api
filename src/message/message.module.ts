import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('EXPIRE_DURATION') },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Message]),
    AuthModule,
    UsersModule,
    forwardRef(() => ChatModule),
  ],
  providers: [MessageGateway, MessageService],
  exports: [MessageService, SequelizeModule],
})
export class MessageModule {}
