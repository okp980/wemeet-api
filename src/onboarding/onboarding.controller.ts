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
import { BioDataDTO, FileBioData } from './dto/bio-data.dto';
import { GenderDTO } from './dto/gender-dto';
import { PassionDTO } from './dto/passion.dto';
import { NotificationDTO } from './dto/notification.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadReqErrorDto, UnauthenticatedDto } from 'src/auth/dto/auth.dto';
import { ProfileDto } from 'src/users/dto/profile.dto';

@ApiTags('Onboarding')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @ApiOperation({ summary: 'Update bio-data during onboarding' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Select image to upload',
    type: FileBioData,
  })
  @ApiOkResponse({
    description: 'Bio-data updated successfully',
    type: ProfileDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
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

  @ApiOperation({ summary: 'Update gender during onboarding' })
  @ApiOkResponse({
    description: 'Gender updated successfully',
    type: ProfileDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Post('gender')
  async gender(@Req() request: any, @Body() gender: GenderDTO) {
    return this.onboardingService.gender(request.user, gender);
  }

  @ApiOperation({ summary: 'Update passion during onboarding' })
  @ApiOkResponse({
    description: 'Passions updated successfully',
    type: ProfileDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Post('passion')
  async passion(@Req() request: any, @Body() passion: PassionDTO) {
    return this.onboardingService.passion(request.user, passion);
  }

  // @ApiOperation({ summary: 'Update notification during onboarding' })
  // @ApiOkResponse({
  //   description: 'Notif updated successfully',
  //   type: ProfileDto,
  // })
  // @ApiUnauthorizedResponse({
  //   description: 'User not authenticated',
  //   type: UnauthenticatedDto,
  // })
  // @Post('notification')
  // async nofication(@Req() request: any, @Body() notification: NotificationDTO) {
  //   return this.onboardingService.nofication(request.user, notification);
  // }
}
