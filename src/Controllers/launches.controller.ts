import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Launches')
@Controller('launches')
export class LaunchesController {
  @Public()
  @Get()
  findAll() {}

  @Public()
  @Get(':id')
  findOne() {}

  @ApiBearerAuth()
  @Post()
  create() {}

  @ApiBearerAuth()
  @Patch(':id')
  update() {}

  @ApiBearerAuth()
  @Delete(':id')
  remove() {}
}
