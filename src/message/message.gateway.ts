import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { Message } from './models/message.model';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly messageService: MessageService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const [_, token] = client.handshake?.headers.authorization.split(' ') ?? [];
    if (!token) {
      throw new WsException('Not Authenticated');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('TOKEN_SECRET'),
      });
      const user = await this.userService.findById(payload.sub);

      user.socketId = client.id;
      await user.save();
      client.data.user = user;

      const chats = await this.chatService.getUserChats(user.id);

      return this.server.to(client.id).emit('chats', chats);
    } catch (error) {
      console.log(error);

      client.disconnect();
      // throw new WsException('Not Authorized');
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.userService.clearSocketId(client.data.user.id);
      client.disconnect();
    } catch (error) {
      // throw new WsException('Not Authorized');
    }
  }

  private async getMessageRecipient(chatId: number, creator: number) {
    const chat = await this.chatService.getChat(chatId);
    return chat.users.find((user) => user.id !== creator);
  }
  //\

  @SubscribeMessage('createMessage')
  async handleCreateMessage(
    @MessageBody() { friendId, content }: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const friend = await this.userService.findById(friendId);
    let chat = await this.chatService.getChatFromUsers({
      userId: client.data.user.id,
      friendId,
    });
    if (!chat) {
      chat = await this.chatService.createChat({
        userId: client.data.user.id,
        friendId,
      });
    }
    const message = await this.messageService.create({
      content,
      chatId: chat.id,
      userId: client.data.user.id,
    });

    const userChats = await this.chatService.getUserChats(client.data.user.id);
    const friendChats = await this.chatService.getUserChats(friendId);
    client.to(client.data.user.socketId).emit('chats', userChats);
    client.to(friend.socketId).emit('chats', friendChats);
    client.to(friend.socketId).emit('message', message);

    return message;
  }

  @SubscribeMessage('messages')
  handleMessages(
    @MessageBody() { friendId, page }: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messageService.getChatMessages({
      userId: client.data.user.id,
      friendId,
      page,
    });
  }

  @SubscribeMessage('chats')
  handleChats(
    @MessageBody() getMessagesDto: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.getUserChats(client.data.user.id);
  }

  @SubscribeMessage('typingMessage')
  handleTyping() {
    return this.messageService.typing();
  }
}
