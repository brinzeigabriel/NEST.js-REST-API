import { Module } from '@nestjs/common';
import { LaunchesController } from 'src/Controllers/launches.controller';
import { LaunchesService } from 'src/Services/launches.service';

@Module({
  imports: [],
  controllers: [LaunchesController],
  providers: [LaunchesService],
})
export class LaunchesModule {}
