import { Test, TestingModule } from '@nestjs/testing';
import { MeetRequestService } from './meet-request.service';

describe('MeetService', () => {
  let service: MeetRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetRequestService],
    }).compile();

    service = module.get<MeetRequestService>(MeetRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
