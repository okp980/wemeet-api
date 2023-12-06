import { IsBoolean } from 'class-validator';

export class NotificationDTO {
  @IsBoolean()
  getNotifications: boolean;
}
