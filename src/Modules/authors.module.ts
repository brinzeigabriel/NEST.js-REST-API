import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsController } from 'src/Controllers/authors.controller';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { AuthorsService } from 'src/Services/authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])], //makes orm aware of this entity with forFeature
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
