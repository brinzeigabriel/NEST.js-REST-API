import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLaunchDto } from 'src/DTOs/create-launch.dto';
import { UpdateAuthorDto } from 'src/DTOs/update-author.dto';
import { UpdateBookDto } from 'src/DTOs/update-book.dto';
import { UpdateLaunchDto } from 'src/DTOs/update-launch.dto';
import { UpdateLibraryDto } from 'src/DTOs/update-library.dto';
import { Author } from 'src/Entities/author.entity';
import { Book } from 'src/Entities/book.entity';
import { Launch } from 'src/Entities/launch.entity';
import { Library } from 'src/Entities/library.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Not, Repository } from 'typeorm';

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
    await this.checkCreateDuplicateBookLaunch(launchBook, launchLibrary);

    await this.checkCreateMatchingAuthor(launchBook, launchAuthor);

    await this.checkCreateAuthorAvailability(
      launchAuthor,
      createLaunchDto.bookLaunchDate,
      createLaunchDto.bookLaunchTime,
    );

    await this.checkCreateLibraryAvailability(
      launchLibrary,
      createLaunchDto.bookLaunchDate,
      createLaunchDto.bookLaunchTime,
    );

    // Verificam compatibilitatea intervalului orar de lansare cu intervalul autorului
    await this.checkCreateLaunchTimeAuthorCompatibility(
      launchAuthor,
      createLaunchDto.bookLaunchTime,
    );

    // Verificam compatibilitatea intervalului orar de lansare cu intervalul librariei
    await this.checkCreateLaunchTimeLibraryCompatibility(
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

  async update(id: number, updateLaunchDto: UpdateLaunchDto): Promise<Launch> {
    const launchBook =
      updateLaunchDto.launchBook &&
      (await this.preloadBook(updateLaunchDto.launchBook));

    const launchAuthor =
      updateLaunchDto.launchAuthor &&
      (await this.preloadAuthor(updateLaunchDto.launchAuthor));

    const launchLibrary =
      updateLaunchDto.launchLibrary &&
      (await this.preloadLibrary(updateLaunchDto.launchLibrary));

    const launch = await this.launchesRepository.preload({
      launchId: +id,
      ...updateLaunchDto,
      launchBook,
      launchAuthor,
      launchLibrary,
    });

    if (!launch) throw new NotFoundException(`Launch #${id} not found`);

    // verificare daca sunt duplicate ale aceleasi carti in librarie
    // ea(launchBook.bookId) sa nu fie planificata in aceeasi librarie din body(launchLibrary.libraryId) sau din DB(launch.libraryId)
    // ea(launchLibrary.libraryId) sa nu aiba planificata aceeasi carte din body(launchBook.bookId) sau din DB(launch.bookId)
    await this.checkUpdateDuplicateBookLaunch(
      launchBook?.bookId || launch.bookId,
      launchLibrary?.libraryId || launch.libraryId,
      launch,
    );

    // verificare daca cartea si autorul corespund
    // ea(launchBook.bookId) sa corespunda cu autorul din body(launchAuthor.authorId) sau din DB(launch.authorId)
    // el(launchAuthor.authorId) sa corespunda cu cartea din body(launchBook.bookId) sau din DB(launch.bookId)
    await this.checkUpdateMatchingAuthor(
      launchBook?.bookId || launch.bookId,
      launchAuthor?.authorId || launch.authorId,
    );

    // verificam compatibilitatea intervalului orar de lansare a cartii cu intervalul librariei
    await this.checkUpdateLaunchTimeLibraryCompatibility(
      launchLibrary?.libraryId || launch.libraryId,
      updateLaunchDto?.bookLaunchTime || launch.bookLaunchTime,
    );

    // Verificam compatibilitatea intervalului orar de lansare a cartii cu intervalul autorului
    await this.checkUpdateLaunchTimeAuthorCompatibility(
      launchAuthor?.authorId || launch.authorId,
      updateLaunchDto?.bookLaunchTime || launch.bookLaunchTime,
    );

    // verificare daca autorul nu se suprapune cu alta programare
    await this.checkUpdateAuthorAvailability(
      launchAuthor?.authorId || launch.authorId,
      updateLaunchDto?.bookLaunchDate || launch.bookLaunchDate,
      updateLaunchDto?.bookLaunchTime || launch.bookLaunchTime,
    );

    // verificare daca in librarie nu se suprapune cu alta programare
    await this.checkUpdateLibraryAvailability(
      launchLibrary?.libraryId || launch.libraryId,
      updateLaunchDto?.bookLaunchDate || launch.bookLaunchDate,
      updateLaunchDto?.bookLaunchTime || launch.bookLaunchTime,
    );

    return this.launchesRepository.save(launch);
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

  // create()
  private async checkCreateMatchingAuthor(
    launchBook: Book,
    launchAuthor: Author,
  ) {
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

  private async checkCreateAuthorAvailability(
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
        'The author is unavailable during this time slot.',
      );
    }
  }

  private async checkCreateLibraryAvailability(
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
        'The library is occupied during this time interval.',
      );
    }
  }

  private async checkCreateLaunchTimeAuthorCompatibility(
    entity: Author,
    launchTime: string,
  ): Promise<void> {
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
          'Launch time slot is not compatible with the author time slot.',
        );
      }
    }
  }

  private async checkCreateLaunchTimeLibraryCompatibility(
    entity: Library,
    launchTime: string,
  ): Promise<void> {
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
          'Launch time slot is not compatible with the library time slot.',
        );
      }
    }
  }

  private async checkCreateDuplicateBookLaunch(
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
        'The same book cannot be released again in the same library.',
      );
    }
  }

  // update()
  private async checkUpdateMatchingAuthor(
    bookId: number,
    authorId: number,
  ): Promise<void> {
    const existingBook = await this.booksRepository.findOne({
      where: {
        bookId,
      },
      relations: ['bookAuthors'],
    });

    if (!existingBook) {
      throw new BadRequestException(`Book with ID ${bookId} not found`);
    }

    const matchingAuthor = existingBook.bookAuthors?.find(
      (author) => author.authorId === authorId,
    );

    if (!matchingAuthor) {
      throw new BadRequestException(
        'Author of the book does not match the specified author',
      );
    }
  }

  private async checkUpdateAuthorAvailability(
    authorId: number,
    launchDate: string,
    launchTime: string,
  ): Promise<void> {
    const existingAuthorSchedule = await this.launchesRepository.findOne({
      where: {
        authorId: authorId,
        bookLaunchDate: launchDate,
        bookLaunchTime: launchTime,
      },
    });

    if (existingAuthorSchedule) {
      throw new BadRequestException(
        'The author is unavailable during this time slot.',
      );
    }
  }

  private async checkUpdateLibraryAvailability(
    libraryId: number,
    launchDate: string,
    launchTime: string,
  ): Promise<void> {
    const existingLibrarySchedule = await this.launchesRepository.findOne({
      where: {
        libraryId: libraryId,
        bookLaunchDate: launchDate,
        bookLaunchTime: launchTime,
      },
    });

    if (existingLibrarySchedule) {
      throw new BadRequestException(
        'The library is occupied during this time interval.',
      );
    }
  }

  private async checkUpdateLaunchTimeAuthorCompatibility(
    authorId: number,
    launchTime: string,
  ): Promise<void> {
    const author = await this.authorsRepository.findOne({
      where: { authorId },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${author} not found`);
    }
    const startTime = author.availableStartTime;
    const endTime = author.availableEndTime;

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
          'Launch time slot is not compatible with the Author time slot.',
        );
      }
    }
  }

  private async checkUpdateLaunchTimeLibraryCompatibility(
    libraryId: number,
    launchTime: string,
  ): Promise<void> {
    const library = await this.librariesRepository.findOne({
      where: { libraryId },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }
    const startTime = library.startTime;
    const endTime = library.endTime;

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
          'Launch time slot is not compatible with the Library time slot.',
        );
      }
    }
  }

  private async checkUpdateDuplicateBookLaunch(
    bookId: number,
    libraryId: number,
    launch: Launch,
  ): Promise<void> {
    const existingLaunch = await this.launchesRepository.findOne({
      where: {
        launchBook: { bookId },
        launchLibrary: { libraryId },
        launchId: Not(launch.launchId), // Exclude the current launch
      },
    });

    if (existingLaunch) {
      throw new BadRequestException(
        'This book is already planned to launch in this library.',
      );
    }
  }
}
