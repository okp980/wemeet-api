import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialAuthDto } from './dto/social-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('social-login')
  socialLogin(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.socialLogin(socialAuthDto);
  }
}
