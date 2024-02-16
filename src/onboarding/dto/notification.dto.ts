import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class NotificationDTO {
  @ApiProperty()
  @IsBoolean()
  getNotifications: boolean;
}
