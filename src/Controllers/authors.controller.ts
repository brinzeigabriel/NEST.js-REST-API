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
import { CreateAuthorDto } from 'src/DTOs/create-author.dto';
import { UpdateAuthorDto } from 'src/DTOs/update-author.dto';
import { AuthorsService } from 'src/Services/authors.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.authorsService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.authorsService.findOne(id);
  }

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    //typesafety + flexibility with DTOs
    return this.authorsService.create(createAuthorDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.authorsService.remove(id);
  }
}
