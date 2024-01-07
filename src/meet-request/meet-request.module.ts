import { Module } from '@nestjs/common';
import { MeetRequestService } from './meet-request.service';
import { MeetRequestController } from './meet-request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Meet } from './models/meet.model';
import { MeetListener } from './listeners/meet.listener';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Meet]),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MeetRequestController],
  providers: [MeetRequestService, MeetListener],
})
export class MeetRequestModule {}
