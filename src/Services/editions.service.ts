import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEditionDto } from 'src/DTOs/create-edition.dto';
import { UpdateEditionDto } from 'src/DTOs/update-edition.dto';
import { Edition } from 'src/Entities/edition.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class EditionsService {
  constructor(
    @InjectRepository(Edition)
    private readonly editionsRepository: Repository<Edition>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Edition[]> {
    const { limit, offset } = paginationQuery;
    return this.editionsRepository.find({
      order: {
        editionId: 'ASC',
      },
      relations: ['books'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(editionId: number): Promise<Edition> {
    const edition = await this.editionsRepository.findOne({
      where: { editionId },
      relations: ['books'],
    });
    if (!edition) {
      throw new NotFoundException(`Edition with ID #${editionId} not found`);
    }
    return edition;
  }

  async create(createEditionDto: CreateEditionDto): Promise<Edition> {
    const newEdition = this.editionsRepository.create(createEditionDto);
    return this.editionsRepository.save(newEdition);
  }

  async update(
    id: number,
    updateEditionDto: UpdateEditionDto,
  ): Promise<Edition> {
    const edition = await this.findOne(id); // Check if the edition exists

    // Update only the provided fields
    await this.editionsRepository.update(id, updateEditionDto);

    // Fetch the updated edition
    return this.findOne(id);
  }

  async remove(editionId: number): Promise<void> {
    const edition = await this.findOne(editionId); // Check if the edition exists
    await this.editionsRepository.remove(edition);
  }
}
