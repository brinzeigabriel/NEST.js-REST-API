import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('authors')
export class AuthorsController {
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
