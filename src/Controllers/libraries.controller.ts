import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('libraries')
export class LibrariesController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Post()
  create() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
