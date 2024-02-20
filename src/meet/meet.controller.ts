import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { MeetService } from './meet.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetMeetRequestDto } from 'src/meet-request/dto/get-meet-request.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MeetDto, Status } from 'src/meet-request/dto/meet-request.dto';
import { PaginatedDto } from 'src/shared/dto/paginated.dto';
import { BadReqErrorDto, UnauthenticatedDto } from 'src/auth/dto/auth.dto';

@ApiTags('Meets')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('meets')
export class MeetController {
  constructor(private readonly meetService: MeetService) {}

  @ApiOperation({ summary: 'Get all user meets(friends)' })
  @ApiOkResponse({
    description: 'Retrieved paginated meets(friends) successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(MeetDto) },
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Get()
  findAll(@Request() request: any, @Query() getMeetDto: GetMeetRequestDto) {
    return this.meetService.findAll(request.user.id, getMeetDto);
  }
}
