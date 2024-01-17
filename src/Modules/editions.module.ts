import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionsController } from 'src/Controllers/editions.controller';
import { Book } from 'src/Entities/book.entity';
import { Edition } from 'src/Entities/edition.entity';
import { EditionsService } from 'src/Services/editions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edition, Book])],
  controllers: [EditionsController],
  providers: [EditionsService],
})
export class EditionsModule {}
