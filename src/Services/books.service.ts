import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/DTOs/create-book.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { Books } from 'src/Entities/books.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private readonly booksRepository: Repository<Books>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Books[]> {
    const { limit, offset } = paginationQuery;
    return this.booksRepository.find({
      order: {
        bookId: 'ASC',
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(bookId: number): Promise<Books> {
    const book = await this.booksRepository.findOne({
      where: { bookId },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID #${bookId} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Books> {
    const newBook = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Books> {
    const book = await this.findOne(id); // Check if the book exists

    // Update only the provided fields
    await this.booksRepository.update(id, updateBookDto);

    // Fetch the updated book
    return this.findOne(id);
  }

  async remove(bookId: number): Promise<void> {
    const book = await this.findOne(bookId); // Check if the book exists
    await this.booksRepository.remove(book);
  }
}
