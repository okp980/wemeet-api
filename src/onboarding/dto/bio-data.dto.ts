import { IsString } from 'class-validator';

export class BioDataDTO {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  dateOfBirth: string;
}
