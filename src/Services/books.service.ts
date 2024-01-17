import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/DTOs/create-book.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { Edition } from 'src/Entities/edition.entity';
import { Library } from 'src/Entities/library.entity';
import { Publisher } from 'src/Entities/publisher.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,

    @InjectRepository(Library)
    private readonly librariesRepository: Repository<Library>,

    @InjectRepository(Publisher)
    private readonly publishersRepository: Repository<Publisher>,

    @InjectRepository(Edition)
    private readonly editionsRepository: Repository<Edition>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Book[]> {
    const { limit, offset } = paginationQuery;
    return this.booksRepository.find({
      order: {
        bookId: 'ASC',
      },
      relations: ['bookAuthors', 'libraries', 'publishers', 'bookEditions'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(bookId: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { bookId },
      relations: ['bookAuthors', 'libraries', 'publishers', 'bookEditions'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID #${bookId} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const bookAuthors =
      createBookDto.bookAuthors &&
      (await Promise.all(
        createBookDto.bookAuthors.map((author) => this.preloadAuthor(author)),
      ));

    const libraries =
      createBookDto.libraries &&
      (await Promise.all(
        createBookDto.libraries.map((library) => this.preloadLibrary(library)),
      ));

    const publishers =
      createBookDto.publishers &&
      (await Promise.all(
        createBookDto.publishers.map((publisher) =>
          this.preloadPublisher(publisher),
        ),
      ));

    const bookEditions =
      createBookDto.bookEditions &&
      (await Promise.all(
        createBookDto.bookEditions.map((edition) =>
          this.preloadEdition(edition),
        ),
      ));

    const newBook = this.booksRepository.create({
      ...createBookDto,
      bookAuthors, //overwrite bookAuthors entity prop with the new const bookAuthors from above
      libraries,
      publishers,
      bookEditions,
    });
    return this.booksRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const bookAuthors =
      updateBookDto.bookAuthors &&
      (await Promise.all(
        updateBookDto.bookAuthors.map((author) => this.preloadAuthor(author)),
      ));

    const libraries =
      updateBookDto.libraries &&
      (await Promise.all(
        updateBookDto.libraries.map((library) => this.preloadLibrary(library)),
      ));

    const publishers =
      updateBookDto.publishers &&
      (await Promise.all(
        updateBookDto.publishers.map((publisher) =>
          this.preloadPublisher(publisher),
        ),
      ));

    const bookEditions =
      updateBookDto.bookEditions &&
      (await Promise.all(
        updateBookDto.bookEditions.map((edition) =>
          this.preloadEdition(edition),
        ),
      ));

    const book = await this.booksRepository.preload({
      bookId: +id,
      ...updateBookDto,
      bookAuthors,
      libraries,
      publishers,
      bookEditions,
    });

    if (!book) throw new NotFoundException(`Book #${id} not found`);

    return this.booksRepository.save(book);
  }

  async remove(bookId: number): Promise<void> {
    const book = await this.findOne(bookId); // Check if the book exists
    await this.booksRepository.remove(book);
  }

  private async preloadAuthor(author: {
    firstName: string;
    lastName: string;
  }): Promise<Author> {
    const existingAuthor = await this.authorsRepository.findOne({
      where: {
        firstName: author.firstName,
        lastName: author.lastName,
      },
    });

    if (existingAuthor) {
      return existingAuthor;
    }

    return this.authorsRepository.create(author);
  }

  private async preloadLibrary(library: {
    libraryName: string;
    startTime: string;
    endTime: string;
  }): Promise<Library> {
    const existingLibrary = await this.librariesRepository.findOne({
      where: {
        libraryName: library.libraryName,
        startTime: library.startTime,
        endTime: library.endTime,
      },
    });

    if (existingLibrary) {
      return existingLibrary;
    }

    return this.librariesRepository.create(library);
  }

  private async preloadPublisher(publisher: {
    publisherName: string;
  }): Promise<Publisher> {
    const existingPublisher = await this.publishersRepository.findOne({
      where: {
        publisherName: publisher.publisherName,
      },
    });

    if (existingPublisher) {
      return existingPublisher;
    }

    return this.publishersRepository.create(publisher);
  }

  private async preloadEdition(edition: {
    editionName: string;
  }): Promise<Edition> {
    const existingEdition = await this.editionsRepository.findOne({
      where: {
        editionName: edition.editionName,
      },
    });

    if (existingEdition) {
      return existingEdition;
    }

    return this.editionsRepository.create(edition);
  }
}
