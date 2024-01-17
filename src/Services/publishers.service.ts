import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePublisherDto } from 'src/DTOs/create-publisher.dto';
import { UpdatePublisherDto } from 'src/DTOs/update-publisher.dto';
import { Publisher } from 'src/Entities/publisher.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publishersRepository: Repository<Publisher>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Publisher[]> {
    const { limit, offset } = paginationQuery;
    return this.publishersRepository.find({
      order: {
        publisherId: 'ASC',
      },
      relations: ['books'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(publisherId: number): Promise<Publisher> {
    const publisher = await this.publishersRepository.findOne({
      where: { publisherId },
      relations: ['books'],
    });
    if (!publisher) {
      throw new NotFoundException(
        `Publisher with ID #${publisherId} not found`,
      );
    }
    return publisher;
  }

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    const newPublisher = this.publishersRepository.create(createPublisherDto);
    return this.publishersRepository.save(newPublisher);
  }

  async update(
    id: number,
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    const publisher = await this.findOne(id); // Check if the publisher exists

    // Update only the provided fields
    await this.publishersRepository.update(id, updatePublisherDto);

    // Fetch the updated publisher
    return this.findOne(id);
  }

  async remove(publisherId: number): Promise<void> {
    const publisher = await this.findOne(publisherId); // Check if the publisher exists
    await this.publishersRepository.remove(publisher);
  }
}
