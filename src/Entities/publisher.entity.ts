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
import { IsNotEmpty } from 'class-validator';
/*
Publishers
=================================================
publisher_id|publisher_name|created_at|updated_at
=================================================
*/
@Entity('publishers')
export class Publisher {
  @PrimaryGeneratedColumn({ name: 'publisher_id' })
  publisherId: number;

  @Index()
  @Unique(['publisherName'])
  @Column({
    name: 'publisher_name',
    nullable: false,
  })
  @IsNotEmpty()
  publisherName: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // una/mai multe edituri au una/mai multe carti
  @ManyToMany((type) => Book, (books) => books.publishers)
  books: Book[];
}
