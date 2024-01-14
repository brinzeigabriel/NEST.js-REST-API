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
import { CreateEditionDto } from 'src/DTOs/create-edition.dto';
import { UpdateEditionDto } from 'src/DTOs/update-edition.dto';
import { EditionsService } from 'src/Services/editions.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.editionsService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.editionsService.findOne(id);
  }

  @Post()
  async create(@Body() createEditionDto: CreateEditionDto) {
    //typesafety + flexibility with DTOs
    return this.editionsService.create(createEditionDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEditionDto: UpdateEditionDto,
  ) {
    return this.editionsService.update(id, updateEditionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.editionsService.remove(id);
  }
}
