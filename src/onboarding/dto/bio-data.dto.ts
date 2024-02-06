import { IsNumber, IsString } from 'class-validator';

export class BioDataDTO {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsNumber()
  age: number;
}
