import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsController } from 'src/Controllers/authors.controller';
import { Authors } from 'src/Entities/authors.entity';
import { AuthorsService } from 'src/Services/authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authors])], //makes orm aware of this entity with forFeature
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
