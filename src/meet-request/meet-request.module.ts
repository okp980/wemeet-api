import { Module } from '@nestjs/common';
import { MeetRequestService } from './meet-request.service';
import { MeetRequestController } from './meet-request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MeetRequest } from './models/meet-request.model';
import { MeetListener } from './listeners/meet.listener';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MeetRequest]),
    UsersModule,
    SharedModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('EXPIRE_DURATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MeetRequestController],
  providers: [MeetRequestService, MeetListener],
  exports: [MeetRequestService],
})
export class MeetRequestModule {}
