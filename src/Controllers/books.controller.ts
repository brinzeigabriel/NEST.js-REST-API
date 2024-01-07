import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('books')
export class BooksController {
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
