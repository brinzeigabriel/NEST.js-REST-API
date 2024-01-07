import { Module } from '@nestjs/common';
import { AuthorsController } from 'src/Controllers/authors.controller';
import { AuthorsService } from 'src/Services/authors.service';

@Module({
  imports: [],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
