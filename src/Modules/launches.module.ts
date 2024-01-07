import { Module } from '@nestjs/common';
import { EditionsController } from 'src/Controllers/editions.controller';
import { EditionsService } from 'src/Services/editions.service';

@Module({
  imports: [],
  controllers: [EditionsController],
  providers: [EditionsService],
})
export class EditionsModule {}
