import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: GetUsersDto, @Req() request: any) {
    return this.usersService.findAll(query, request.user.id);
  }
}

@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMe(@Req() request: any) {
    return 'well';
  }
}
