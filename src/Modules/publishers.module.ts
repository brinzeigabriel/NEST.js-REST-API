import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishersController } from 'src/Controllers/publishers.controller';
import { Publishers } from 'src/Entities/publishers.entity';
import { PublishersService } from 'src/Services/publishers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publishers])],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
