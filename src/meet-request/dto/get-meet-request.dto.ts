import { PaginatedQueryDto } from 'src/shared/dto/paginated.dto';
import { Status } from './meet-request.dto';

export class GetMeetRequestDto extends PaginatedQueryDto {
  status: Status;
}
