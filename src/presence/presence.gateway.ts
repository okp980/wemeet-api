import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PresenceService } from './presence.service';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MeetRequestService } from 'src/meet-request/meet-request.service';

type ActiveUser = {
  id: number;
  socketId: string;
  isActive: boolean;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly presenceService: PresenceService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private meetRequest: MeetRequestService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const [_, token] =
        client.handshake?.headers.authorization.split(' ') ?? [];
      if (!token) {
        this.handleDisconnect(client);
        return;
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('TOKEN_SECRET'),
      });
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.handleDisconnect(client);
        return;
      }

      client.data.user = user;

      this.setActiveStatus(client, true);
    } catch (error) {
      console.log('error is', error);

      this.handleDisconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('HANDLE DISCONNECT');
    await this.setActiveStatus(client, false);
  }

  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus(
    @MessageBody('isActive')
    isActive: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data?.user) return;

    await this.setActiveStatus(client, isActive);
  }

  private async setActiveStatus(client: Socket, isActive: boolean) {
    const activeUser: ActiveUser = {
      id: client.data.user.id,
      socketId: client.id,
      isActive,
    };

    await this.cacheManager.set(`user_${client.data.user.id}`, activeUser);
    await this.emitStatusToFriends(activeUser);
  }
  private async emitStatusToFriends(activeUser: ActiveUser) {
    const friends = await this.meetRequest.findAllMeets(activeUser.id);
    for (const friend of friends) {
      const cacheUser: ActiveUser = await this.cacheManager.get(
        `user_${(await friend).id}`,
      );
      if (!cacheUser) continue;
      this.server
        .to(cacheUser.socketId)
        .emit('isActive', { id: activeUser.id, isActive: activeUser.isActive });
      if (activeUser.isActive) {
        this.server.to(activeUser.socketId).emit('isActive', {
          id: cacheUser.id,
          isActive: cacheUser.isActive,
        });
      }
      //
    }
  }
}
