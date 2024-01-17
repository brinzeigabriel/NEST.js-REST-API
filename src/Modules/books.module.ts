import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from 'src/Controllers/books.controller';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { Edition } from 'src/Entities/edition.entity';
import { Library } from 'src/Entities/library.entity';
import { Publisher } from 'src/Entities/publisher.entity';
import { BooksService } from 'src/Services/books.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Edition, Library, Publisher]), //register entities with typeorm
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
