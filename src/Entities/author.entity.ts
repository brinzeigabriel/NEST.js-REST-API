import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
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
  firstName: string;

  @Index()
  @Column({
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  // unul/mai multi autori sunt asociati cu una/mai multe carti
  @ManyToMany((type) => Book, (books) => books.bookAuthors)
  books: Book[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}