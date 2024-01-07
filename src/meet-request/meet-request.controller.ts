import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MeetRequestService } from './meet-request.service';
import { CreateMeetRequestDto } from './dto/create-meet-request.dto';
import { UpdateMeetRequestDto } from './dto/update-meet-request.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('meet-requests')
export class MeetRequestController {
  constructor(private readonly MeetRequestService: MeetRequestService) {}

  @Get()
  async find(@Request() request: any, @Query('status') status: string) {
    return this.MeetRequestService.find(request.user.id, { status });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.MeetRequestService.findOne(+id);
  }
  @Post()
  async create(
    @Body() makeRequestDto: CreateMeetRequestDto,
    @Req() request: any,
  ) {
    return this.MeetRequestService.create(makeRequestDto, request.user.id);
  }

  @Patch(':id')
  async update(
    @Body() @Param('id') id: string,
    updateRequestDto: UpdateMeetRequestDto,
  ) {
    return this.MeetRequestService.update(+id, updateRequestDto);
  }
}
