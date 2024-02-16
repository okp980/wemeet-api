import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';

enum Passion {
  photography = 'photography',
  shopping = 'shopping',
  karaoke = 'karaoke',
  yoga = 'yoga',
  cooking = 'cooking',
  tennis = 'tennis',
  run = 'run',
  swimming = 'swimming',
  art = 'art',
  traveling = 'traveling',
  extreme = 'extreme',
  music = 'music',
  drink = 'drink',
  videoGames = 'video games',
}
export class PassionDTO {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  passion: string[];
}
