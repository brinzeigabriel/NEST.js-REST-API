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
import { CreateBookDto } from 'src/DTOs/create-book.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { BooksService } from 'src/Services/books.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('books')
export class BooksController {
  //injecting the BooksService inside BooksController
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.booksService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    //typesafety + flexibility with DTOs
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}
