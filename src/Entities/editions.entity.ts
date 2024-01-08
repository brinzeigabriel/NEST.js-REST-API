import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Books } from './books.entity';
/*
Editions
===================================================
edition_id|edition_name|created_at|updated_at
===================================================
*/
@Entity()
export class Editions {
  @PrimaryGeneratedColumn()
  edition_id: number;

  @Index()
  @Unique(['edition_name'])
  @Column({ nullable: false })
  edition_name: string;

  // una/mai multe editii este asociata unei carti
  @ManyToOne((type) => Books, (books) => books.book_editions)
  @JoinColumn({ name: 'book_id' })
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
