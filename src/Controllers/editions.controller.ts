import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('Editions')
export class EditionsController {
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
