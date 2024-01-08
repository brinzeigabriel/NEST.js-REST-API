import {
  Check,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Authors } from './authors.entity';
import { Editions } from './editions.entity';
import { Libraries } from './libraries.entity';
import { Publishers } from './publishers.entity';
/*
Books
========================================================================================================================
book_id|book_title|book_description|book_pages|book_price|book_rating|book_publish_year|book_sales|created_at|updated_at
========================================================================================================================
*/
@Entity() // sql table === 'Books' if you want to be named something else @Entity('newName')
export class Books {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Index()
  @Unique(['book_title'])
  @Column({ nullable: false })
  book_title: string;

  @JoinTable()
  // o carte are una/mai multe editii
  @OneToMany((type) => Editions, (editions) => editions.books, {
    cascade: true,
  })
  book_editions: Editions[];

  @JoinTable({
    name: 'books_authors', // Numele tabelei de legătură
    joinColumn: { name: 'book_id', referencedColumnName: 'book_id' }, // Numele coloanei pentru entitatea curentă
    inverseJoinColumn: { name: 'author_id', referencedColumnName: 'author_id' }, // Numele coloanei pentru entitatea asociată
  }) // va crea automat o tabela
  // una/mai multe carti sunt asociate cu unul/mai multi autori
  @ManyToMany((type) => Authors, (authors) => authors.books, {
    cascade: true, // adds automatically record in AuthorTable when books is populated
  })
  book_authors: Authors[];

  @Column({ nullable: false })
  book_description: string;

  @Column({ nullable: false })
  @Check(`"book_pages">= 0`)
  book_pages: number;

  @Column({ nullable: false })
  @Check(`"book_price">= 0`)
  book_price: number;

  @Column({ default: 0 })
  @Check(`"book_rating" >= 0 AND "book_rating" <= 10`)
  book_rating: number;

  @JoinTable({
    name: 'books_libraries',
    joinColumn: { name: 'book_id', referencedColumnName: 'book_id' },
    inverseJoinColumn: {
      name: 'library_id',
      referencedColumnName: 'library_id',
    },
  })
  // una/mai multe carti pot fi in una/mai multe librarii
  @ManyToMany((type) => Libraries, (libraries) => libraries.books, {
    cascade: true,
  })
  libraries: Libraries[];

  @JoinTable({
    name: 'books_publishers',
    joinColumn: { name: 'book_id', referencedColumnName: 'book_id' },
    inverseJoinColumn: {
      name: 'publisher_id',
      referencedColumnName: 'publisher_id',
    },
  })
  // una/mai multe carti are una/mai multe edituri
  @ManyToMany((type) => Publishers, (publishers) => publishers.books, {
    cascade: true,
  })
  publishers: Publishers[];

  @Column({ type: 'date', nullable: false })
  book_publish_year: Date;

  @Column({ default: 0 })
  book_sales: number;

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
