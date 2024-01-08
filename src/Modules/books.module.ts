import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from 'src/Controllers/books.controller';
import { Authors } from 'src/Entities/authors.entity';
import { Books } from 'src/Entities/books.entity';
import { Editions } from 'src/Entities/editions.entity';
import { Libraries } from 'src/Entities/libraries.entity';
import { Publishers } from 'src/Entities/publishers.entity';
import { BooksService } from 'src/Services/books.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Books,
      Authors,
      Editions,
      Libraries,
      Publishers,
      Event,
    ]), //register entities with typeorm
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
