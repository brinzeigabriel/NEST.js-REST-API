import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchesController } from 'src/Controllers/launches.controller';
import { Launches } from 'src/Entities/launches.entity';
import { LaunchesService } from 'src/Services/launches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Launches])],
  controllers: [LaunchesController],
  providers: [LaunchesService],
})
export class LaunchesModule {}
