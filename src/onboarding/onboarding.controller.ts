import { Body, Controller, Post, Req } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { BioDataDTO } from './dto/bio-data.dto';
import { GenderDTO } from './dto/gender-dto';
import { PassionDTO } from './dto/passion.dto';
import { NotificationDTO } from './dto/notification.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('bio-data')
  async bioData(@Req() request: any, @Body() bioData: BioDataDTO) {
    return this.onboardingService.bioData(request.user, bioData);
  }
  @Post('gender')
  async gender(@Req() request: any, @Body() gender: GenderDTO) {
    return this.onboardingService.gender(request.user, gender);
  }
  @Post('passion')
  async passion(@Req() request: any, @Body() passion: PassionDTO) {
    return this.onboardingService.passion(request.user, passion);
  }
  @Post('notification')
  async nofication(@Req() request: any, @Body() notification: NotificationDTO) {
    return this.onboardingService.nofication(request.user, notification);
  }
}
