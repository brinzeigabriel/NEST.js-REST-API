import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLaunchDto } from 'src/DTOs/create-launch.dto';
import { UpdateLaunchDto } from 'src/DTOs/update-launch.dto';
import { LaunchesService } from 'src/Services/launches.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Launches')
@Controller('launches')
export class LaunchesController {
  constructor(private readonly launchesService: LaunchesService) {}

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.launchesService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.launchesService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new launch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        launchBook: {
          type: 'object',
          properties: {
            bookTitle: { type: 'string' },
          },
          required: ['bookTitle'],
        },
        launchAuthor: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
          required: ['firstName', 'lastName'],
        },
        launchLibrary: {
          type: 'object',
          properties: {
            libraryName: { type: 'string' },
          },
          required: ['libraryName'],
        },
        bookLaunchDate: { type: 'string', format: 'date' },
        bookLaunchTime: { type: 'string', format: 'time', example: '15:00' },
      },
      required: [
        'launchBook',
        'launchAuthor',
        'launchLibrary',
        'bookLaunchDate',
        'bookLaunchTime',
      ],
    },
  })
  create(@Body() createLaunchDto: CreateLaunchDto) {
    //typesafety + flexibility with DTOs
    return this.launchesService.create(createLaunchDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a launch by ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        launchBook: {
          type: 'object',
          properties: {
            bookTitle: { type: 'string' },
          },
          required: ['bookTitle'],
        },
        launchAuthor: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
          required: ['firstName', 'lastName'],
        },
        launchLibrary: {
          type: 'object',
          properties: {
            libraryName: { type: 'string' },
          },
          required: ['libraryName'],
        },
        bookLaunchDate: { type: 'string', format: 'date' },
        bookLaunchTime: { type: 'string', format: 'time', example: '15:00' },
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLaunchDto: UpdateLaunchDto) {
    return this.launchesService.update(id, updateLaunchDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.launchesService.remove(id);
  }
}
