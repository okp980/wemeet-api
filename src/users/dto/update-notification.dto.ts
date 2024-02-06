import { CreateProfileDto } from './create-profile.dto';

export interface UpdateNotificationDto
  extends Pick<CreateProfileDto, 'getNotifications'> {}
