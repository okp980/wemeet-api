import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
