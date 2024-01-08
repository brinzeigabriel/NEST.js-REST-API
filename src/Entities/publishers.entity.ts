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
Publishers
=======================================================
publisher_id|publisher_name|created_at|updated_at
=======================================================
*/
@Entity()
export class Publishers {
  @PrimaryGeneratedColumn()
  publisher_id: number;

  @Index()
  @Unique(['publisher_name'])
  @Column({ nullable: false })
  publisher_name: string;

  // una/mai multe edituri au una/mai multe carti
  @ManyToMany((type) => Books, (books) => books.publishers)
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
