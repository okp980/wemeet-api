import { User } from 'src/users/entities/user.entity';
import { GetMeetRequestDto } from '../dto/get-meet-request.dto';
import { Status } from '../dto/meet-request.dto';

export const query = (): GetMeetRequestDto => ({
  status: Status.accepted,
  page: 1,
  limit: 10,
});

export const recipientStub = (id = 1): User => ({
  id,
});
export const creatorStub = (id = 2): User => ({
  id,
});

export const meetRequestStub = (recipientid = 1, creatorId = 2): any => ({
  creator: creatorStub(creatorId),
  recipient: recipientStub(recipientid),
  status: 'pending',
});

export const paginatedResultStub = (result: any) => ({
  total: 1,
  currentPage: 1,
  nextPage: null,
  previousPage: null,
  totalPages: 1,
  data: [result],
});
