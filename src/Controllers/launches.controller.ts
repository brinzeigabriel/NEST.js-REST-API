import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLaunchDto } from 'src/DTOs/create-launch.dto';
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
  create(@Body() createLaunchDto: CreateLaunchDto) {
    //typesafety + flexibility with DTOs
    return this.launchesService.create(createLaunchDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update() {}

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.launchesService.remove(id);
  }
}
