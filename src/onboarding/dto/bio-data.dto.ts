import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BioDataDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: 'number' })
  // @IsNumber()
  age: number;
}

export class FileBioData extends BioDataDTO {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: any;
}
