import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesController } from 'src/Controllers/libraries.controller';
import { Book } from 'src/Entities/book.entity';
import { Library } from 'src/Entities/library.entity';
import { LibrariesService } from 'src/Services/libraries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Book])],
  controllers: [LibrariesController],
  providers: [LibrariesService],
})
export class LibrariesModule {}
