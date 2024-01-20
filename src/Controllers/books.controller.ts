import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBookDto } from 'src/DTOs/create-book.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { BooksService } from 'src/Services/books.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  //injecting the BooksService inside BooksController
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.booksService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    //typesafety + flexibility with DTOs
    return this.booksService.create(createBookDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}
