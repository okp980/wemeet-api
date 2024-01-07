import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { BioDataDTO } from './dto/bio-data.dto';
import { GenderDTO } from './dto/gender-dto';
import { PassionDTO } from './dto/passion.dto';
import { NotificationDTO } from './dto/notification.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@UseGuards(AuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('bio-data')
  @UseInterceptors(FileInterceptor('image'))
  async bioData(
    @Req() request: any,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() bioData: BioDataDTO,
  ) {
    return this.onboardingService.bioData(request.user, bioData, image);
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
