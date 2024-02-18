import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        const result = { access_token: 'some_token' };
        if (token === AuthService) {
          return { register: jest.fn().mockResolvedValue(result) };
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

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('register', () => {
    it('should return an object with access token', () => {
      const result = { access_token: 'some_token' };
      // jest.spyOn(service, 'register').mockImplementation(async () => result);
      jest.spyOn(service, 'register').mockReturnValue(Promise.resolve(result));
      expect(
        controller.register({ email: 'sds', password: '', name: '' }),
      ).resolves.toBe(result);
    });
  });
});
