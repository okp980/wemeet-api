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
import { SocialAuthDto } from './dto/social-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('social-login')
  socialLogin(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.socialLogin(socialAuthDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any) {
    return req.user.profile;
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req: any, @Body() profileDto: UpdateMeDto) {
    return this.authService.updateProfile(req.user, profileDto);
  }
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
