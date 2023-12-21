import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialAuthDto {
  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  token: string;
}
