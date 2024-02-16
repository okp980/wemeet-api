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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MeetDto, Status } from './dto/meet-request.dto';
import { GetMeetRequestDto } from './dto/get-meet-request.dto';
import { BadReqErrorDto, UnauthenticatedDto } from 'src/auth/dto/auth.dto';
import { PaginatedDto } from 'src/shared/dto/paginated.dto';

@ApiTags('Meet Request')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('meet-requests')
@ApiExtraModels(PaginatedDto)
export class MeetRequestController {
  constructor(private readonly MeetRequestService: MeetRequestService) {}

  @ApiOperation({ summary: 'Get paginated user meet requests' })
  @ApiQuery({ name: 'status', enum: Status })
  @ApiOkResponse({
    description: 'Retrieved paginated meet request successfully',
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
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Get()
  async find(@Request() request: any, @Query() query: GetMeetRequestDto) {
    return this.MeetRequestService.find(request.user.id, query);
  }

  @ApiOperation({ summary: 'Get single user meet request' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({
    description: 'Retrieved single meet request successfully',
    type: MeetDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.MeetRequestService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create a meet request' })
  @ApiCreatedResponse({
    description: 'Created a meet request successfully',
    type: MeetDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Post()
  async create(
    @Body() makeRequestDto: CreateMeetRequestDto,
    @Req() request: any,
  ) {
    return this.MeetRequestService.create(makeRequestDto, request.user.id);
  }

  @ApiOperation({ summary: 'Update a meet request' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({
    description: 'Updated a meet request successfully',
    type: MeetDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadReqErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    type: UnauthenticatedDto,
  })
  @Patch(':id')
  async update(
    @Body() updateRequestDto: UpdateMeetRequestDto,
    @Param('id') id: string,
  ) {
    return this.MeetRequestService.update(+id, updateRequestDto);
  }
}
