import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesController } from 'src/Controllers/libraries.controller';
import { Libraries } from 'src/Entities/libraries.entity';
import { LibrariesService } from 'src/Services/libraries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Libraries])],
  controllers: [LibrariesController],
  providers: [LibrariesService],
})
export class LibrariesModule {}
