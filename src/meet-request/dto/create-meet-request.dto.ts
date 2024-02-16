import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMeetRequestDto {
  @ApiProperty()
  @IsNumber()
  recipient: number;
}
