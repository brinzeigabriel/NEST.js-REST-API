import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('editions')
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
