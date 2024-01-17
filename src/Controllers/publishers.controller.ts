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
import { AuthGuard } from '@nestjs/passport';
import { CreatePublisherDto } from 'src/DTOs/create-publisher.dto';
import { UpdatePublisherDto } from 'src/DTOs/update-publisher.dto';
import { PublishersService } from 'src/Services/publishers.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.publishersService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.publishersService.findOne(id);
  }

  @Post()
  async create(@Body() createPublisherDto: CreatePublisherDto) {
    //typesafety + flexibility with DTOs
    return this.publishersService.create(createPublisherDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publishersService.update(id, updatePublisherDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.publishersService.remove(id);
  }
}
