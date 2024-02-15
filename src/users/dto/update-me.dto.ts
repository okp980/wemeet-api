import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  getNotifications: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio: string;
}
