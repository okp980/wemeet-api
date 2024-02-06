import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  getNotifications: boolean;

  @IsString()
  @IsOptional()
  bio: string;
}
