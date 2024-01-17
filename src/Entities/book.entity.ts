import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Edition } from './edition.entity';
import { Library } from './library.entity';
import { Publisher } from './publisher.entity';
/*
Books
========================================================================================================================
book_id|book_title|book_description|book_pages|book_price|book_rating|book_publish_year|book_sales|created_at|updated_at
========================================================================================================================
*/
@Entity('books') // sql table === 'Books' if you want to be named something else @Entity('newName')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  bookId: number;

  @Index()
  @Unique(['book_title'])
  @Column({
    name: 'book_title',
    nullable: false,
  })
  bookTitle: string;

  @JoinTable({
    name: 'books_editions',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'bookId',
    },
    inverseJoinColumn: {
      name: 'edition_id',
      referencedColumnName: 'editionId',
    },
  })
  // una/mai multe carti au una/mai multe editii
  @ManyToMany((type) => Edition, (editions) => editions.books, {
    cascade: true,
  })
  bookEditions: Edition[];

  @JoinTable({
    name: 'books_authors', // Numele tabelei de legătură
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'bookId',
    }, // Numele coloanei pentru entitatea curentă
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'authorId',
    }, // Numele coloanei pentru entitatea asociată
  }) // va crea automat o tabela
  // una/mai multe carti sunt asociate cu unul/mai multi autori
  @ManyToMany((type) => Author, (authors) => authors.books, {
    cascade: true, // allow to add record
  })
  bookAuthors: Author[];

  @Column({
    name: 'book_description',
    nullable: false,
  })
  bookDescription: string;

  @Column({
    name: 'book_pages',
    nullable: false,
  })
  @Check(`"book_pages">= 0`)
  bookPages: number;

  @Column({
    name: 'book_price',
    nullable: false,
  })
  @Check(`"book_price">= 0`)
  bookPrice: number;

  @Column({
    name: 'book_rating',
    default: 0,
  })
  @Check(`"book_rating" >= 0 AND "book_rating" <= 10`)
  bookRating: number;

  @JoinTable({
    name: 'books_libraries',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'bookId',
    },
    inverseJoinColumn: {
      name: 'library_id',
      referencedColumnName: 'libraryId',
    },
  })
  // una/mai multe carti pot fi in una/mai multe librarii
  @ManyToMany((type) => Library, (libraries) => libraries.books, {
    cascade: true,
  })
  libraries: Library[];

  @JoinTable({
    name: 'books_publishers',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'bookId',
    },
    inverseJoinColumn: {
      name: 'publisher_id',
      referencedColumnName: 'publisherId',
    },
  })
  // una/mai multe carti are una/mai multe edituri
  @ManyToMany((type) => Publisher, (publishers) => publishers.books, {
    cascade: true,
  })
  publishers: Publisher[];

  @Column({
    name: 'book_publish_year',
    type: 'date',
    nullable: false,
  })
  bookPublishYear: Date;

  @Column({
    name: 'book_sales',
    default: 0,
  })
  bookSales: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
