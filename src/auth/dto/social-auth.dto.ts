import { IsString } from 'class-validator';

export class SocialAuthDto {
  @IsString()
  provider: string;
  @IsString()
  token: string;
}
