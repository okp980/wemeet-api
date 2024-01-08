import { Injectable } from '@nestjs/common';
import { GetMeetRequestDto } from 'src/meet-request/dto/get-meet-request.dto';
import { MeetRequestService } from 'src/meet-request/meet-request.service';

@Injectable()
export class MeetService {
  constructor(private meetRequestService: MeetRequestService) {}

  findAll(userId: number, params: GetMeetRequestDto) {
    return this.meetRequestService.findMeets(userId, params);
  }
}
