import { IsEnum } from 'class-validator';
export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class UpdateMeetRequestDto {
  @IsEnum(RequestStatus)
  status: string;
}
