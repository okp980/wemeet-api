import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  age: string;

  @ApiProperty({ nullable: true })
  passion: string;

  @ApiProperty()
  getNotifications: boolean;

  @ApiProperty({ default: 1 })
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
