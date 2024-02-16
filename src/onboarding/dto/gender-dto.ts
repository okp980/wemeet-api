import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

enum Gender {
  male = 'male',
  female = 'female',
}

export class GenderDTO {
  @ApiProperty({ enum: Gender })
  @IsString()
  @IsEnum(Gender)
  gender: Gender;
}
