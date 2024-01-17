import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishersController } from 'src/Controllers/publishers.controller';
import { Book } from 'src/Entities/book.entity';
import { Publisher } from 'src/Entities/publisher.entity';
import { PublishersService } from 'src/Services/publishers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher, Book])],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
