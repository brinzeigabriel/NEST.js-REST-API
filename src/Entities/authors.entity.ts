import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Books } from './books.entity';
/* 
Authors
==========================================================
author_id|first_name|last_name|created_at|updated_at
==========================================================
*/
@Entity()
@Unique(['first_name', 'last_name'])
export class Authors {
  @PrimaryGeneratedColumn()
  author_id: number;

  @Index()
  @Column({ nullable: false })
  first_name: string;

  @Index()
  @Column({ nullable: false })
  last_name: string;

  // unul/mai multi autori sunt asociati cu una/mai multe carti
  @ManyToMany((type) => Books, (books) => books.book_authors)
  books: Books[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
