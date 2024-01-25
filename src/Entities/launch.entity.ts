import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Library } from './library.entity';
import { Author } from './author.entity';
/*
Launches
========================================================================================================================
launch_id|book_launch_date|author_confirmation|book_id|author_id|library_id|created_at|updated_at
========================================================================================================================
*/
@Entity('launches')
export class Launch {
  @PrimaryGeneratedColumn({ name: 'launch_id' })
  launchId: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ name: 'book_id' })
  bookId: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'library_id' })
  libraryId: number;

  @Column({
    name: 'book_launch_date',
    nullable: false,
    type: 'date',
  })
  bookLaunchDate: string;

  @Column({
    name: 'book_launch_time',
    type: 'time',
    nullable: false,
  })
  bookLaunchTime: string;

  //mai multe lansari pot avea aceeasi carte
  @ManyToOne((type) => Book, (book) => book.launches)
  @JoinColumn({
    name: 'book_id',
    referencedColumnName: 'bookId',
  })
  launchBook: Book;

  //la mai multe lansari pot participa acelasi autor
  @ManyToOne((type) => Author, (author) => author.launches)
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'authorId',
  })
  launchAuthor: Author;

  //mai multe lansari pot avea loc in aceeasi librarie
  @ManyToOne((type) => Library, (library) => library.launches)
  @JoinColumn({
    name: 'library_id',
    referencedColumnName: 'libraryId',
  })
  launchLibrary: Library;
}
