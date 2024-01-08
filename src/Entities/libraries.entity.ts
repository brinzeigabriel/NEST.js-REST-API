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
Libraries
===================================================
library_id|library_name|created_at|updated_at
===================================================
*/
@Entity()
export class Libraries {
  @PrimaryGeneratedColumn()
  library_id: number;

  @Index()
  @Unique(['library_name'])
  @Column({ nullable: false })
  library_name: string;

  // una/mai multe librarii pot avea una/mai multe carti
  @ManyToMany((type) => Books, (books) => books.libraries)
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
