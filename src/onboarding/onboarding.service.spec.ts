import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('OnboardingService', () => {
  let service: OnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingService],
    })
      .useMocker((token) => {
        const result = { access_token: 'some_token' };
        if (token === OnboardingService) {
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

    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
