import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;
  @IsNumber()
  userId: number;
  @IsNumber()
  friendId: number;
  // TODO:remove
  @IsNumber()
  chat: number;
}
