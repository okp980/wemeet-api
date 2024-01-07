import { IsNumber, IsString } from 'class-validator';

export class CreateMeetRequestDto {
  @IsNumber()
  recipient: number;
}
