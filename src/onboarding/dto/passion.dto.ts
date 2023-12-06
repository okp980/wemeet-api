import { IsString, IsArray } from 'class-validator';

export class PassionDTO {
  @IsArray()
  @IsString({ each: true })
  passion: string[];
}
