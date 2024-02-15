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
import { ProfileDto } from 'src/users/dto/profile.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/register.dto';
import {
  BadReqErrorDto,
  FileUploadDto,
  RegisterForbiddenErrorDto,
  UnauthenticatedDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Register new users via email.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AuthDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
    type: BadReqErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'Email has already been used.',
    type: RegisterForbiddenErrorDto,
  })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({
    summary: 'Login via email.',
  })
  @ApiOkResponse({
    description: 'The user successfully signed in.',
    type: AuthDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
    type: BadReqErrorDto,
  })
  @Post('email-login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOperation({
    summary: 'Login via social provider.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AuthDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post('social-login')
  socialLogin(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.socialLogin(socialAuthDto);
  }

  @ApiOperation({
    summary: 'Get login user profile',
  })
  @ApiOkResponse({
    description: ' Profile retrieved successfully',
    type: ProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any) {
    return req.user.profile;
  }

  @ApiOperation({
    summary: 'Update user profile',
  })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: UpdateMeDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @ApiBearerAuth()
  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req: any, @Body() profileDto: UpdateMeDto) {
    return this.authService.updateProfile(req.user, profileDto);
  }

  @ApiOperation({
    summary: 'Update user profile picture',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Select image to upload',
    type: FileUploadDto,
  })
  @ApiOkResponse({
    description: 'Profile pic updated successfully',
    type: ProfileDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
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
