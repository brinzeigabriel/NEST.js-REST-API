import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionsController } from 'src/Controllers/editions.controller';
import { Editions } from 'src/Entities/editions.entity';
import { EditionsService } from 'src/Services/editions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Editions])],
  controllers: [EditionsController],
  providers: [EditionsService],
})
export class EditionsModule {}
