import { Injectable } from '@nestjs/common';
import { BioDataDTO } from './dto/bio-data.dto';
import { UsersService } from 'src/users/users.service';
import { GenderDTO } from './dto/gender-dto';
import { PassionDTO } from './dto/passion.dto';
import { NotificationDTO } from './dto/notification.dto';
import { Express } from 'express';

@Injectable()
export class OnboardingService {
  constructor(private readonly userService: UsersService) {}
  async bioData(user: any, data: BioDataDTO, file: Express.Multer.File) {
    return this.userService.updateUserProfile(user.id, data, file);
  }
  async gender(user: any, data: GenderDTO) {
    return this.userService.updateUserProfile(user.id, data);
  }
  async passion(user: any, data: PassionDTO) {
    return this.userService.updateUserProfile(user.id, data);
  }
  async nofication(user: any, data: NotificationDTO) {
    return this.userService.updateUserProfile(user.id, data);
  }
}
