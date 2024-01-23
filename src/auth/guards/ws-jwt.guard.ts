import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token: string = this.extractTokenFromHeader(client);
      if (!token) {
        throw new WsException('Not Authenticated');
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('TOKEN_SECRET'),
        });
        const user = await this.userService.findById(payload.sub);
        client['user'] = user;
      } catch {
        throw new WsException('Not Authorized');
      }
      return true;
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] = client.handshake?.headers.authorization ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
