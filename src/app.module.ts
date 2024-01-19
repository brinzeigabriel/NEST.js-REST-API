import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './Modules/books.module';
import { AuthorsModule } from './Modules/authors.module';
import { EditionsModule } from './Modules/editions.module';
import { LaunchesModule } from './Modules/launches.module';
import { LibrariesModule } from './Modules/libraries.module';
import { PublishersModule } from './Modules/publishers.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    //here add .modules.ts to start module endpoints
    AuthorsModule,
    BooksModule,
    EditionsModule,
    LaunchesModule,
    LibrariesModule,
    PublishersModule,

    AuthModule, //introducem autorizare in tot API-ul

    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // typeorm entities should e synced with db, !!!false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
