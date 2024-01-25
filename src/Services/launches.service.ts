import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLaunchDto } from 'src/DTOs/create-launch.dto';
import { UpdateAuthorDto } from 'src/DTOs/update-author.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { UpdateLibraryDto } from 'src/DTOs/update-library.dto';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { Launch } from 'src/Entities/launch.entity';
import { Library } from 'src/Entities/library.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { MoreThan, Repository } from 'typeorm';

export class LaunchesService {
  constructor(
    @InjectRepository(Launch)
    private readonly launchesRepository: Repository<Launch>,

    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,

    @InjectRepository(Library)
    private readonly librariesRepository: Repository<Library>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Launch[]> {
    const { limit, offset } = paginationQuery;
    return this.launchesRepository.find({
      order: {
        launchId: 'ASC',
      },
      relations: ['launchBook', 'launchAuthor', 'launchLibrary'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(launchId: number): Promise<Launch> {
    const launch = await this.launchesRepository.findOne({
      where: { launchId },
      relations: ['launchBook', 'launchAuthor', 'launchLibrary'],
    });
    if (!launch) {
      throw new NotFoundException(`Launch with ID #${launchId} not found`);
    }
    return launch;
  }

  async create(createLaunchDto: CreateLaunchDto): Promise<Launch> {
    const launchBook =
      createLaunchDto.launchBook &&
      (await this.preloadBook(createLaunchDto.launchBook));

    const launchAuthor =
      createLaunchDto.launchAuthor &&
      (await this.preloadAuthor(createLaunchDto.launchAuthor));

    const launchLibrary =
      createLaunchDto.launchLibrary &&
      (await this.preloadLibrary(createLaunchDto.launchLibrary));

    //verifica si duplicatele, astfel incat aceeasi carte sa nu poate fi lansata mai mult de o data intr-o librarie vreodata.
    await this.checkDuplicateBookLaunch(launchBook, launchLibrary);

    await this.checkMatchingAuthor(launchBook, launchAuthor);

    await this.checkAuthorAvailability(
      launchAuthor,
      createLaunchDto.bookLaunchDate,
      createLaunchDto.bookLaunchTime,
    );

    await this.checkLibraryAvailability(
      launchLibrary,
      createLaunchDto.bookLaunchDate,
      createLaunchDto.bookLaunchTime,
    );

    // Verificam compatibilitatea intervalului orar de lansare cu intervalul autorului
    this.checkLaunchTimeAuthorCompatibility(
      launchAuthor,
      createLaunchDto.bookLaunchTime,
    );

    // Verificam compatibilitatea intervalului orar de lansare cu intervalul librariei
    this.checkLaunchTimeLibraryCompatibility(
      launchLibrary,
      createLaunchDto.bookLaunchTime,
    );

    const newLaunch = this.launchesRepository.create({
      ...createLaunchDto,
      launchBook,
      launchAuthor,
      launchLibrary,
    });
    return this.launchesRepository.save(newLaunch);
  }

  async remove(launchId: number): Promise<void> {
    const launch = await this.findOne(launchId);
    await this.launchesRepository.remove(launch);
  }

  private async preloadBook(bookData: UpdateBookDto): Promise<Book> {
    const existingBook = await this.booksRepository.findOne({
      where: {
        bookTitle: bookData.bookTitle,
      },
    });

    if (existingBook) {
      return existingBook;
    } else {
      throw new NotFoundException('Book not found');
    }
  }

  private async preloadAuthor(authorData: UpdateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorsRepository.findOne({
      where: {
        firstName: authorData.firstName,
        lastName: authorData.lastName,
      },
    });

    if (existingAuthor) {
      return existingAuthor;
    } else {
      throw new NotFoundException('Author not found');
    }
  }

  private async preloadLibrary(
    libraryData: UpdateLibraryDto,
  ): Promise<Library> {
    const existingLibrary = await this.librariesRepository.findOne({
      where: {
        libraryName: libraryData.libraryName,
      },
    });

    if (existingLibrary) {
      return existingLibrary;
    } else {
      throw new NotFoundException('Library not found');
    }
  }

  private async checkMatchingAuthor(launchBook: Book, launchAuthor: Author) {
    const existingBook = await this.booksRepository.findOne({
      where: {
        bookTitle: launchBook.bookTitle,
      },
      relations: ['bookAuthors'],
    });

    const matchingAuthor = existingBook.bookAuthors?.find(
      (author) =>
        author.firstName === launchAuthor.firstName &&
        author.lastName === launchAuthor.lastName,
    );

    if (!matchingAuthor) {
      throw new BadRequestException(
        'Author of the book does not match the specified author',
      );
    }
  }

  private async checkAuthorAvailability(
    author: Author,
    launchDate: string,
    launchTime: string,
  ): Promise<void> {
    const existingAuthorSchedule = await this.launchesRepository.findOne({
      where: {
        authorId: author.authorId,
        bookLaunchDate: launchDate,
        bookLaunchTime: launchTime,
      },
    });

    if (existingAuthorSchedule) {
      throw new BadRequestException(
        'Autorul este indisponibil in acest interval orar.',
      );
    }
  }

  private async checkLibraryAvailability(
    library: Library,
    launchDate: string,
    launchTime: string,
  ): Promise<void> {
    const existingLibrarySchedule = await this.launchesRepository.findOne({
      where: {
        libraryId: library.libraryId,
        bookLaunchDate: launchDate,
        bookLaunchTime: launchTime,
      },
    });

    if (existingLibrarySchedule) {
      throw new BadRequestException(
        'Libraria este ocupata in acest interval orar.',
      );
    }
  }

  private checkLaunchTimeAuthorCompatibility(
    entity: Author,
    launchTime: string,
  ): void {
    const startTime = entity.availableStartTime;
    const endTime = entity.availableEndTime;

    if (startTime && endTime) {
      const launchTimeParts = launchTime.split(':');
      const launchHour = parseInt(launchTimeParts[0]);
      const launchMinute = parseInt(launchTimeParts[1]);

      const startParts = startTime.split(':');
      const startHour = parseInt(startParts[0]);
      const startMinute = parseInt(startParts[1]);

      const endParts = endTime.split(':');
      const endHour = parseInt(endParts[0]);
      const endMinute = parseInt(endParts[1]);

      if (
        launchHour < startHour ||
        (launchHour === startHour && launchMinute < startMinute) ||
        launchHour > endHour ||
        (launchHour === endHour && launchMinute > endMinute)
      ) {
        throw new BadRequestException(
          'Intervalul orar de lansare nu este compatibil cu intervalul orar al autorului.',
        );
      }
    }
  }

  private checkLaunchTimeLibraryCompatibility(
    entity: Library,
    launchTime: string,
  ): void {
    const startTime = entity.startTime;
    const endTime = entity.endTime;

    if (startTime && endTime) {
      const launchTimeParts = launchTime.split(':');
      const launchHour = parseInt(launchTimeParts[0]);
      const launchMinute = parseInt(launchTimeParts[1]);

      const startParts = startTime.split(':');
      const startHour = parseInt(startParts[0]);
      const startMinute = parseInt(startParts[1]);

      const endParts = endTime.split(':');
      const endHour = parseInt(endParts[0]);
      const endMinute = parseInt(endParts[1]);

      if (
        launchHour < startHour ||
        (launchHour === startHour && launchMinute < startMinute) ||
        launchHour > endHour ||
        (launchHour === endHour && launchMinute > endMinute)
      ) {
        throw new BadRequestException(
          'Intervalul orar de lansare nu este compatibil cu intervalul orar al librariei.',
        );
      }
    }
  }

  private async checkDuplicateBookLaunch(
    launchBook: Book,
    launchLibrary: Library,
  ): Promise<void> {
    const existingLaunch = await this.launchesRepository.findOne({
      where: {
        launchBook: { bookId: launchBook.bookId },
        launchLibrary: { libraryId: launchLibrary.libraryId },
      },
    });

    if (existingLaunch) {
      throw new BadRequestException(
        'Aceeași carte nu poate fi lansată din nou în aceeași librarie.',
      );
    }
  }
}
