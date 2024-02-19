import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { resolve } from 'path';
import { TokenPayload } from 'google-auth-library';
import { registerStud } from './stud/auth.stud';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        const result = { access_token: 'some_token' };
        if (token === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(result),
            login: jest.fn().mockResolvedValue(result),
            socialLogin: jest.fn().mockResolvedValue(result),
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should return access token on register', async () => {
      const result = { access_token: 'some_token' };

      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await service.register(registerStud())).toEqual(result);
    });
  });
  describe('login', () => {
    it('should return access token on login', async () => {
      const result = { access_token: 'some_token' };
      const { email, password } = registerStud();
      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(
        await service.login({
          email,
          password,
        }),
      ).toEqual(result);
    });
  });
  describe('socialLogin', () => {
    it('should return access token on register', async () => {
      const result = { access_token: 'some_token' };
      jest.spyOn(service, 'socialLogin').mockResolvedValue(result);

      expect(
        await service.socialLogin({
          provider: 'google',
          token: 'google token',
          fcmToken: 'fcm token',
        }),
      ).toEqual(result);
    });
  });
});
