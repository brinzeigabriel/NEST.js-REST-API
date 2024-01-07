import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('publishers')
export class PublishersController {
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
