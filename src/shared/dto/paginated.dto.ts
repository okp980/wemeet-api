import { ApiProperty } from '@nestjs/swagger';

export class PaginatedQueryDto {
  @ApiProperty({ default: 1 })
  limit?: number;

  @ApiProperty({ default: 1 })
  page?: number;
}

export class PaginatedDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  nextPage: number;

  @ApiProperty()
  previousPage: number;

  @ApiProperty()
  totalPages: number;

  results: T[];
}
