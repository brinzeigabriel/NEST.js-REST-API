import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('launches')
export class LaunchesController {
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
