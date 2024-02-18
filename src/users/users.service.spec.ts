import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { userStub } from './stub/user.stub';
import { PaginatedQueryDto } from 'src/shared/dto/paginated.dto';
import { paginatedResultStub } from 'src/shared/stub/shared.stub';
import { NotFoundException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let service: UsersService;
  let userModel: typeof User;
  let profileModel: typeof Profile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findAll: jest.fn(),
            findAndCountAll: jest.fn(),
            findOrCreate: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Profile),
          useValue: {},
        },
      ],
    })
      .useMocker((token) => {
        if (token === UsersService) {
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

    service = module.get<UsersService>(UsersService);
    userModel = module.get<typeof User>(getModelToken(User));
    profileModel = module.get<typeof Profile>(getModelToken(Profile));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user', async () => {
      const result = userStub();
      jest.spyOn(userModel, 'create').mockReturnValue(result);
      const user = await service.create({
        email: 'some@example.com',
        password: 'hash',
        provider: 'email',
      });
      expect(user).toBe(result);
      expect(userModel.create).toHaveBeenCalled();
    });
  });
  describe('findAll', () => {
    it('should return paginated list of users', async () => {
      const user = { ...userStub(), id: 1 };
      const query: PaginatedQueryDto = {
        page: 1,
        limit: 10,
      };
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(paginatedResultStub(user));
      const result = await service.findAll(query, user.id);
      expect(result.total).toEqual(1);
      expect(result.currentPage).toEqual(query.page);
      expect(result.data.length).toBeLessThanOrEqual(query.limit);
    });
  });
  describe('findOrCreate', () => {
    it('should return a user', async () => {
      const user = { ...userStub(), id: 1 };
      jest
        .spyOn(service, 'findOrCreate')
        .mockResolvedValue([user as User, true]);
      const result = await service.findOrCreate(
        {
          email: 'user@example.com',
          provider: 'email',
          fcmToken: 'someToken',
        },
        'user@example.com',
      );

      expect(result[0]).toEqual(user);
    });
  });
  describe('findById', () => {
    const user = { ...userStub(), id: 1 };
    it('should return the user with given ID', async () => {
      const findSpy = jest
        .spyOn(userModel, 'findByPk')
        .mockResolvedValue(user as User);
      const result = await service.findById(user.id);

      expect(result).toBe(user);
      expect(findSpy).toHaveBeenCalled();
    });
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findById(user.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('findOne', () => {
    const user = { ...userStub(), id: 1 };
    it('should return the user with given attribute', async () => {
      const findSpy = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(user as User);
      const result = await service.findOne({ email: 'user@example.com' });

      expect(result).toBe(user);
      expect(findSpy).toHaveBeenCalled();
    });
    it('should throw NotFoundException if user is not found with given attribute', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.findOne({ email: 'invalid email' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
