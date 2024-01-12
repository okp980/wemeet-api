import { WebSocketGateway } from '@nestjs/websockets';
import { PresenceService } from './presence.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PresenceGateway {
  constructor(private readonly presenceService: PresenceService) {}
}
