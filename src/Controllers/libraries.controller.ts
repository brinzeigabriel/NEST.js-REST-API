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
import { CreateLibraryDto } from 'src/DTOs/create-library.dto';
import { UpdateLibraryDto } from 'src/DTOs/update-library.dto';
import { LibrariesService } from 'src/Services/libraries.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.librariesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.librariesService.findOne(id);
  }

  @Post()
  async create(@Body() createLibraryDto: CreateLibraryDto) {
    //typesafety + flexibility with DTOs
    return this.librariesService.create(createLibraryDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLibraryDto: UpdateLibraryDto,
  ) {
    return this.librariesService.update(id, updateLibraryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.librariesService.remove(id);
  }
}
