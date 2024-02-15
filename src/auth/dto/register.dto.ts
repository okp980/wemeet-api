import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class LoginDto {
  @ApiProperty({ default: 'johndoe@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'john@1' })
  @IsString()
  password: string;
}
