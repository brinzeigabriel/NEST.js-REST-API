import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { IsNotEmpty } from 'class-validator';
/*
Editions
===================================================
edition_id|edition_name|created_at|updated_at
===================================================
*/
@Entity('editions')
export class Edition {
  @PrimaryGeneratedColumn({ name: 'edition_id' })
  editionId: number;

  @Index()
  @Column({
    name: 'edition_name',
    nullable: false,
  })
  @IsNotEmpty()
  editionName: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // una/mai multe editii sunt asociate unei/mai multor carti
  @ManyToMany((type) => Book, (books) => books.bookEditions)
  books: Book[];
}
