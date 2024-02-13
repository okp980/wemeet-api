import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SocialAuthDto } from './dto/social-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AuthDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post('social-login')
  socialLogin(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.socialLogin(socialAuthDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any) {
    return req.user.profile;
  }

  @ApiBearerAuth()
  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req: any, @Body() profileDto: UpdateMeDto) {
    return this.authService.updateProfile(req.user, profileDto);
  }

  @ApiBearerAuth()
  @Patch('profile/pic')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfilePic(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.userService.updateUserProfile(req.user.id, {}, image);
  }
}
