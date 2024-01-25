import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchesController } from 'src/Controllers/launches.controller';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { Launch } from 'src/Entities/launch.entity';
import { Library } from 'src/Entities/library.entity';
import { LaunchesService } from 'src/Services/launches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Launch, Book, Author, Library])],
  controllers: [LaunchesController],
  providers: [LaunchesService],
})
export class LaunchesModule {}
