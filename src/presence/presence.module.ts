import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceGateway } from './presence.gateway';
import { MeetRequestModule } from 'src/meet-request/meet-request.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MeetRequestModule, UsersModule],
  providers: [PresenceGateway, PresenceService],
})
export class PresenceModule {}
