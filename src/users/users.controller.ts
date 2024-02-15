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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/shared/dto/paginated.dto';
import { UserDto } from './dto/user.dto';
import { UnauthenticatedDto } from 'src/auth/dto/auth.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Paginated list of user' })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiOkResponse({
    description: 'Retrieved all users successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(UserDto) },
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
  findAll(
    @Query() query: GetUsersDto,
    @Req() request: any,
  ): Promise<PaginatedDto<UserDto>> {
    return this.usersService.findAll(query, request.user.id);
  }
}
