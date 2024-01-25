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
Authors
==========================================================
author_id|first_name|last_name|created_at|updated_at
==========================================================
*/
@Entity('authors')
@Unique(['firstName', 'lastName'])
export class Author {
  @PrimaryGeneratedColumn({ name: 'author_id' })
  authorId: number;

  @Index()
  @Column({
    name: 'first_name',
    nullable: false,
  })
  @IsNotEmpty()
  firstName: string;

  @Index()
  @Column({
    name: 'last_name',
    nullable: false,
  })
  @IsNotEmpty()
  lastName: string;

  @Column({ name: 'available_start_time', type: 'time', nullable: true })
  availableStartTime: string;

  @Column({ name: 'available_end_time', type: 'time', nullable: true })
  availableEndTime: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // unul/mai multi autori sunt asociati cu una/mai multe carti
  @ManyToMany((type) => Book, (books) => books.bookAuthors)
  books: Book[];

  @OneToMany((type) => Launch, (launch) => launch.launchAuthor)
  launches: Launch[];
}
