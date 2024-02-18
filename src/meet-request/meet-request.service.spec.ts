import { Test, TestingModule } from '@nestjs/testing';
import { MeetRequestService } from './meet-request.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getModelToken } from '@nestjs/sequelize';
import { MeetRequest } from './models/meet-request.model';
import { User } from 'src/users/models/user.model';
import { MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Profile } from 'src/users/models/profile.model';
import { GetMeetRequestDto } from './dto/get-meet-request.dto';
import { Status } from './dto/meet-request.dto';
import { PaginatedQueryDto } from 'src/shared/dto/paginated.dto';

const moduleMocker = new ModuleMocker(global);

describe('MeetRequestService', () => {
  let service: MeetRequestService;
  let model: typeof MeetRequest;
  let userService: UsersService;

  const recipient = { id: 1 };
  const creator = { id: 2 };

  const MeetRequestData = {
    id: 1,
    creator,
    recipient,
    status: 'pending',
  };

  const paginatedResult = (
    meetRequest: typeof recipient | typeof creator | typeof MeetRequestData,
  ) => ({
    total: 1,
    currentPage: 1,
    nextPage: null,
    previousPage: null,
    totalPages: 1,
    data: [meetRequest],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetRequestService,
        UsersService,
        {
          provide: getModelToken(MeetRequest),
          useValue: {
            findAll: jest.fn(),
            findAndCountAll: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(Profile),
          useValue: {},
        },
      ],
    })
      .useMocker((token) => {
        if (token === MeetRequestService) {
          return {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };
        }
        if (token === UsersService) {
          return {
            findById: jest.fn(),
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

    service = module.get<MeetRequestService>(MeetRequestService);
    userService = module.get<UsersService>(UsersService);
    model = module.get<typeof MeetRequest>(getModelToken(MeetRequest));
  });

  describe('find', () => {
    const userId = 1;
    const query: GetMeetRequestDto = {
      status: Status.accepted,
      page: 1,
      limit: 10,
    };

    it('should return paginated list of meet requests', async () => {
      jest
        .spyOn(service, 'find')
        .mockResolvedValue(paginatedResult(MeetRequestData));
      const result = await service.find(userId, query);
      expect(result.total).toEqual(1);
      expect(result.currentPage).toEqual(query.page);
      expect(result.data.length).toBeLessThanOrEqual(query.limit);
    });
  });

  describe('findOne', () => {
    it('should find and return a meet request by ID', async () => {
      const findSpy = jest
        .spyOn(model, 'findByPk')
        .mockReturnValue(MeetRequestData as any);

      const result = await service.findOne(MeetRequestData.id);

      expect(findSpy).toHaveBeenCalledWith(MeetRequestData.id, {
        include: User,
      });
      expect(result).toEqual(MeetRequestData);
    });

    it('should throw NotFoundException if meet request is not found', async () => {
      const findSpy = jest.spyOn(model, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(MeetRequestData.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(findSpy).toHaveBeenCalledWith(MeetRequestData.id, {
        include: User,
      });
    });
  });

  describe('create', () => {
    describe('already exists', () => {
      it('should throw MethodNotAllowedException if meet status is pending', async () => {
        const createStub = { ...MeetRequestData, status: 'pending' };
        const createSpy = jest
          .spyOn(model, 'create')
          .mockRejectedValue(new MethodNotAllowedException());
        const findOneSpy = jest
          .spyOn(model, 'findOne')
          .mockResolvedValue(createStub as any);

        await expect(
          service.create({ recipient: recipient.id }, creator.id),
        ).rejects.toThrow(MethodNotAllowedException);
        expect(createStub.recipient.id).toBe(recipient.id);
        expect(createStub.status).toBe('pending');
        expect(findOneSpy).toHaveBeenCalledWith({
          where: {
            creatorId: creator.id,
            recipientId: recipient.id,
          },
        });
        expect(createSpy).toHaveBeenCalledTimes(0);
      });
      it('should throw MethodNotAllowedException if meet status is accepted', async () => {
        const createStub = { ...MeetRequestData, status: 'accepted' };
        const createSpy = jest
          .spyOn(model, 'create')
          .mockRejectedValue(new MethodNotAllowedException());
        const findOneSpy = jest
          .spyOn(model, 'findOne')
          .mockResolvedValue(createStub as any);

        await expect(
          service.create({ recipient: recipient.id }, creator.id),
        ).rejects.toThrow(MethodNotAllowedException);
        expect(createStub.recipient.id).toBe(recipient.id);
        expect(createStub.status).toBe('accepted');
        expect(findOneSpy).toHaveBeenCalledWith({
          where: {
            creatorId: creator.id,
            recipientId: recipient.id,
          },
        });
        expect(createSpy).toHaveBeenCalledTimes(0);
      });
      it('should update meet request status to pending, if status was rejected', async () => {
        let createStub = {
          ...MeetRequestData,
          status: 'rejected',
          update: jest.fn(),
        };

        const findOneSpy = jest
          .spyOn(model, 'findOne')
          .mockReturnValueOnce(createStub as any);

        await service.create({ recipient: recipient.id }, creator.id);

        expect(createStub.recipient.id).toBe(recipient.id);
        expect(createStub.status).toBe('rejected');
        expect(findOneSpy).toHaveBeenCalledWith({
          where: {
            creatorId: creator.id,
            recipientId: recipient.id,
          },
        });
      });
    });
    describe('does not exist', () => {
      it('should throw NotFoundException if recipient does not exist', async () => {
        const userServiceSpy = jest
          .spyOn(userService, 'findById')
          .mockResolvedValue(null);
        await expect(
          service.create({ recipient: recipient.id }, creator.id),
        ).rejects.toThrow(NotFoundException);
        expect(userServiceSpy).toHaveBeenCalledWith(recipient.id);
      });
      it('should create a new meet request if it did not exist', async () => {
        const createSpy = jest
          .spyOn(model, 'create')
          .mockResolvedValue(MeetRequestData);
        const userServiceSpy = jest
          .spyOn(userService, 'findById')
          .mockResolvedValue(recipient as any);

        await service.create({ recipient: recipient.id }, creator.id);

        expect(createSpy).toHaveBeenCalledWith({
          creatorId: creator.id,
          recipientId: recipient.id,
        });
        expect(MeetRequestData.recipient.id).toBe(recipient.id);
        expect(MeetRequestData.creator.id).toBe(creator.id);
        expect(MeetRequestData.status).toBe('pending');
        expect(userServiceSpy).toHaveBeenCalledWith(recipient.id);
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if the meet request does not exist', () => {
      const findSpy = jest.spyOn(model, 'findByPk').mockResolvedValue(null);
      expect(
        service.update(MeetRequestData.id, { status: 'accepted' }),
      ).rejects.toThrow(NotFoundException);
      expect(findSpy).toHaveBeenCalledWith(MeetRequestData.id);
    });

    it('should update the status and return the meet request ', async () => {
      jest
        .spyOn(model, 'findByPk')
        .mockResolvedValue({ ...MeetRequestData, update: jest.fn() } as any);
      const result = await service.update(MeetRequestData.id, {
        status: 'accepted',
      });
      expect(result.update).toHaveBeenCalledWith({ status: 'accepted' });
      expect(result.id).toEqual(MeetRequestData.id);
    });
  });

  describe('findMeets', () => {
    it('should return paginated list of accepted requests', async () => {
      const query: PaginatedQueryDto = {
        page: 1,
        limit: 10,
      };
      jest
        .spyOn(service, 'findMeets')
        .mockResolvedValue(paginatedResult(recipient));
      const result = await service.findMeets(creator.id, query);
      expect(result.total).toEqual(1);
      expect(result.currentPage).toEqual(query.page);
      expect(result.data.length).toBeLessThanOrEqual(query.limit);
    });
  });
});
