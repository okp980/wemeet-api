import { ApiProperty } from '@nestjs/swagger';

export class BadReqErrorDto {
  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export class RegisterForbiddenErrorDto {
  @ApiProperty()
  message: string;
}

export class UnauthenticatedDto {
  @ApiProperty()
  message: string;
  @ApiProperty({ default: 401 })
  statusCode: number;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
