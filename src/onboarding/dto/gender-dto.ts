import { IsString } from 'class-validator';

export class GenderDTO {
  @IsString()
  gender: string;
}
