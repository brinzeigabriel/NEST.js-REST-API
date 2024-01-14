import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthorDto } from 'src/DTOs/create-author.dto';
import { UpdateAuthorDto } from 'src/DTOs/update-author.dto';
import { Authors } from 'src/Entities/authors.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Authors)
    private readonly authorsRepository: Repository<Authors>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Authors[]> {
    const { limit, offset } = paginationQuery;
    return this.authorsRepository.find({
      order: {
        authorId: 'ASC',
      },
      // relations: { books: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(authorId: number): Promise<Authors> {
    const author = await this.authorsRepository.findOne({
      where: { authorId },
    });
    if (!author) {
      throw new NotFoundException(`Author with ID #${authorId} not found`);
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Authors> {
    const newAuthor = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(newAuthor);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Authors> {
    const author = await this.findOne(id); // Check if the author exists

    // Update only the provided fields
    await this.authorsRepository.update(id, updateAuthorDto);

    // Fetch the updated author
    return this.findOne(id);
  }

  async remove(authorId: number): Promise<void> {
    const author = await this.findOne(authorId); // Check if the author exists
    await this.authorsRepository.remove(author);
  }
}
