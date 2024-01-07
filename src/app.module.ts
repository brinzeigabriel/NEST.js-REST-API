import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './Modules/books.module';
import { AuthorsModule } from './Modules/authors.module';
import { EditionsModule } from './Modules/editions.module';
import { LibrariesModule } from './Modules/libraries.module';
import { PublishersModule } from './Modules/publishers.module';

@Module({
  imports: [
    //here add .modules.ts
    AuthorsModule,
    BooksModule,
    EditionsModule,
    LibrariesModule,
    PublishersModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'parola',
      database: 'GestiuneCarti',
      autoLoadEntities: true,
      synchronize: true, // typeorm entities should be synced with db in DEV-MODE, !!!false in PRODUCTION-MODE
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
