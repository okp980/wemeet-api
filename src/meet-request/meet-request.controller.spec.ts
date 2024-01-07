import { Test, TestingModule } from '@nestjs/testing';
import { MeetRequestController } from './meet-request.controller';
import { MeetRequestService } from './meet-request.service';

describe('MeetRequestController', () => {
  let controller: MeetRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetRequestController],
      providers: [MeetRequestService],
    }).compile();

    controller = module.get<MeetRequestController>(MeetRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
