import { IsEnum } from 'class-validator';
export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum RequestUpdateStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
export class UpdateMeetRequestDto {
  @IsEnum(RequestUpdateStatus)
  status: string;
}
