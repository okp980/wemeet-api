import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OnboardingModule } from './onboarding/onboarding.module';
import { FileModule } from './file/file.module';
import { MeetRequestModule } from './meet-request/meet-request.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MeetModule } from './meet/meet.module';
import { PresenceModule } from './presence/presence.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    OnboardingModule,
    FileModule,
    MeetRequestModule,
    MeetModule,
    PresenceModule,
    MessageModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
