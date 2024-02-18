import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { paginatedResultStub } from 'src/shared/stub/shared.stub';
import { userStub } from './stub/user.stub';
import { getModelToken } from '@nestjs/sequelize';
import { Profile } from './models/profile.model';
import { User } from './models/user.model';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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
            findAll: jest.fn(),
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a list of users', async () => {
      const user = { ...userStub(), id: 1 };

      const result = paginatedResultStub(user);
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(paginatedResultStub(user));
      const ans = await controller.findAll({ limit: 10, page: 1 }, user.id);
      expect(ans).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
