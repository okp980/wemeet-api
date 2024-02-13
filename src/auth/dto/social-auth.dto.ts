import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SocialAuthDto {
  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fcmToken: string;
}

export class AuthDto {
  @ApiProperty()
  access_token: string;
}
