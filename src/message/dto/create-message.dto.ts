import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;
  @IsNumber()
  user: number;
  @IsNumber()
  chat: number;
}
