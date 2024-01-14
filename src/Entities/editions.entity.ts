import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
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
  @PrimaryGeneratedColumn({ name: 'edition_id' })
  editionId: number;

  @Index()
  @Unique(['editionName'])
  @Column({
    name: 'edition_name',
    nullable: false,
  })
  editionName: string;

  // una/mai multe editii este asociata unei carti
  @ManyToOne((type) => Books, (books) => books.bookEditions)
  @JoinColumn({ name: 'book_id' })
  books: Books[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
