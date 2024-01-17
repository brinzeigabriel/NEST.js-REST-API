import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchesController } from 'src/Controllers/launches.controller';
import { Launch } from 'src/Entities/launch.entity';
import { LaunchesService } from 'src/Services/launches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Launch])],
  controllers: [LaunchesController],
  providers: [LaunchesService],
})
export class LaunchesModule {}
