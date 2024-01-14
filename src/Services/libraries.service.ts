import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLibraryDto } from 'src/DTOs/create-library.dto';
import { UpdateLibraryDto } from 'src/DTOs/update-library.dto';
import { Libraries } from 'src/Entities/libraries.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Libraries)
    private readonly librariesRepository: Repository<Libraries>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Libraries[]> {
    const { limit, offset } = paginationQuery;
    return this.librariesRepository.find({
      order: {
        libraryId: 'ASC',
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(libraryId: number): Promise<Libraries> {
    const library = await this.librariesRepository.findOne({
      where: { libraryId },
    });
    if (!library) {
      throw new NotFoundException(`Library with ID #${libraryId} not found`);
    }
    return library;
  }

  async create(createLibraryDto: CreateLibraryDto): Promise<Libraries> {
    const newLibrary = this.librariesRepository.create(createLibraryDto);
    return this.librariesRepository.save(newLibrary);
  }

  async update(
    id: number,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Libraries> {
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
