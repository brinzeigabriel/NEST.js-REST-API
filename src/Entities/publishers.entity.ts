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
import { Books } from './books.entity';
/*
Publishers
=======================================================
publisher_id|publisher_name|created_at|updated_at
=======================================================
*/
@Entity()
export class Publishers {
  @PrimaryGeneratedColumn({ name: 'publisher_id' })
  publisherId: number;

  @Index()
  @Unique(['publisherName'])
  @Column({
    name: 'publisher_name',
    nullable: false,
  })
  publisherName: string;

  // una/mai multe edituri au una/mai multe carti
  @ManyToMany((type) => Books, (books) => books.publishers)
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
