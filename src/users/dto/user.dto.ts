import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class UserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  profile: ProfileDto;
}
