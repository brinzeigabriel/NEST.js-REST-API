import { Module } from '@nestjs/common';
import { BooksController } from 'src/Controllers/books.controller';
import { BooksService } from 'src/Services/books.service';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
