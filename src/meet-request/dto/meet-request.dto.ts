import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export enum Status {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
}

export class MeetDto {
  @ApiProperty()
  status: Status;

  @ApiProperty()
  creator: UserDto;

  @ApiProperty()
  recipient: UserDto;
}
