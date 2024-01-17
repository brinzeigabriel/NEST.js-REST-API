import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLibraryDto } from 'src/DTOs/create-library.dto';
import { UpdateLibraryDto } from 'src/DTOs/update-library.dto';
import { Library } from 'src/Entities/library.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private readonly librariesRepository: Repository<Library>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Library[]> {
    const { limit, offset } = paginationQuery;
    return this.librariesRepository.find({
      order: {
        libraryId: 'ASC',
      },
      relations: ['books'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(libraryId: number): Promise<Library> {
    const library = await this.librariesRepository.findOne({
      where: { libraryId },
      relations: ['books'],
    });
    if (!library) {
      throw new NotFoundException(`Library with ID #${libraryId} not found`);
    }
    return library;
  }

  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    const newLibrary = this.librariesRepository.create(createLibraryDto);
    return this.librariesRepository.save(newLibrary);
  }

  async update(
    id: number,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    const library = await this.findOne(id); // Check if the library exists

    // Update only the provided fields
    await this.librariesRepository.update(id, updateLibraryDto);

    // Fetch the updated library
    return this.findOne(id);
  }

  async remove(libraryId: number): Promise<void> {
    const library = await this.findOne(libraryId); // Check if the library exists
    await this.librariesRepository.remove(library);
  }
}
