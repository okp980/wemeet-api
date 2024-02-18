import { Test, TestingModule } from '@nestjs/testing';
import { MeetRequestController } from './meet-request.controller';
import { MeetRequestService } from './meet-request.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getModelToken } from '@nestjs/sequelize';
import { MeetRequest } from './models/meet-request.model';
import {
  meetRequestStub,
  paginatedResultStub,
  query,
} from './stub/meet-request.stub';
import { CreateMeetRequestDto } from './dto/create-meet-request.dto';
import { UpdateMeetRequestDto } from './dto/update-meet-request.dto';

const moduleMocker = new ModuleMocker(global);

describe('MeetRequestController', () => {
  let controller: MeetRequestController;
  let service: MeetRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetRequestController],
      providers: [
        MeetRequestService,
        {
          provide: getModelToken(MeetRequest),
          useValue: {},
        },
      ],
    })
      .useMocker((token) => {
        if (token === MeetRequestService) {
          const result = paginatedResultStub(meetRequestStub());
          return {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMeets: jest.fn(),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<MeetRequestController>(MeetRequestController);
    service = module.get<MeetRequestService>(MeetRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a list of meet request', async () => {
      const userId = 1;

      const result = paginatedResultStub(meetRequestStub());
      jest
        .spyOn(service, 'find')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.find(userId, query())).toBe(result);
      expect(service.find).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a single meet request', async () => {
      const Id = 1;

      const result = meetRequestStub();
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findOne(Id)).toBe(result);
      expect(service.findOne).toHaveBeenCalled();
    });
  });
  describe('create', () => {
    it('should return a new meet request', async () => {
      const userId = 2;
      const body: CreateMeetRequestDto = {
        recipient: 1,
      };

      const result = meetRequestStub(1, 2);
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));

      const ans = await controller.create(body, userId);

      expect(ans).toEqual(result);
      expect(service.create).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('should return a new meet request', async () => {
      const id = 1;
      const body: UpdateMeetRequestDto = {
        status: 'accepted',
      };
      const result = { ...meetRequestStub(), status: 'accepted' };
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(result));

      const ans = await controller.update(body, id);

      expect(ans).toEqual(result);
      expect(service.update).toHaveBeenCalled();
    });
  });
});
