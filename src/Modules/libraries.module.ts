import { Module } from '@nestjs/common';
import { LibrariesController } from 'src/Controllers/libraries.controller';
import { LibrariesService } from 'src/Services/libraries.service';

@Module({
  imports: [],
  controllers: [LibrariesController],
  providers: [LibrariesService],
})
export class LibrariesModule {}
