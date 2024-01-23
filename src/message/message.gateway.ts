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

  @SubscribeMessage('createMessage')
  async handleCreateMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const recipient = await this.getMessageRecipient(
      createMessageDto.chat,
      createMessageDto.user,
    );
    const message = await this.messageService.create(createMessageDto);
    client.to(recipient.socketId).emit('newMessage', message);
  }

  @SubscribeMessage('messages')
  handleMessages(@MessageBody() getMessagesDto: GetMessagesDto) {
    return this.messageService.getChatMessages(getMessagesDto);
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(
    @MessageBody() chatDto: Omit<CreateChatDto, 'userId'>,
    @ConnectedSocket() client: Socket,
  ) {
    const friend = await this.userService.findById(chatDto.friendId);
    const chat = await this.chatService.createChat({
      ...chatDto,
      userId: client.data.user.id,
    });
    client.to(friend.socketId).emit('newChat', chat);
    console.log('createChat was called', chat);
    return chat;
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
