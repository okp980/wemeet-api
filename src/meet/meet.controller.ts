import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { MeetService } from './meet.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetMeetRequestDto } from 'src/meet-request/dto/get-meet-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Meets')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('meets')
export class MeetController {
  constructor(private readonly meetService: MeetService) {}

  @Get()
  findAll(@Request() request: any, @Query() getMeetDto: GetMeetRequestDto) {
    return this.meetService.findAll(request.user.id, getMeetDto);
  }
}
