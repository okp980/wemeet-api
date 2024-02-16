import { Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryDto } from './dto/paginated.dto';

@Injectable()
export class PaginatedService {
  private logger = new Logger(PaginatedService.name);
  async getPaginated(
    { page = 1, limit = 10 }: PaginatedQueryDto,
    modelCallback: (
      startIndex: number,
      limit: number,
    ) => Promise<{ count: number; rows: any[] }>,
    changeData?: (data: any[]) => any[],
  ) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const { count, rows } = await modelCallback(startIndex, limit);

    const remains = Math.max(count - endIndex, 0);
    const before = Math.max(page - 1, 0);
    const totalPages = Math.max(Math.ceil(count / limit), 1);
    let data = rows;
    if (changeData) {
      data = changeData(rows);
    }
    this.logger.log('== paginated data ==', data);

    return {
      total: count,
      currentPage: +page,
      nextPage: remains >= 1 ? +page + 1 : null,
      previousPage: before >= 1 ? +page - 1 : null,
      totalPages,
      data,
    };
  }
}
