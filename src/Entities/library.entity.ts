import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { IsNotEmpty } from 'class-validator';
import { Launch } from './launch.entity';
/*
Libraries
===================================================
library_id|library_name|created_at|updated_at
===================================================
*/
@Entity('libraries')
export class Library {
  @PrimaryGeneratedColumn({ name: 'library_id' })
  libraryId: number;

  @Index()
  @Unique(['libraryName'])
  @Column({
    name: 'library_name',
    nullable: false,
  })
  @IsNotEmpty()
  libraryName: string;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // una/mai multe librarii pot avea una/mai multe carti
  @ManyToMany((type) => Book, (books) => books.libraries)
  books: Book[];

  @OneToMany((type) => Launch, (launch) => launch.launchLibrary)
  launches: Launch[];
}
