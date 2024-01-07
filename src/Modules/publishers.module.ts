import { Module } from '@nestjs/common';
import { PublishersController } from 'src/Controllers/publishers.controller';
import { PublishersService } from 'src/Services/publishers.service';

@Module({
  imports: [],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
