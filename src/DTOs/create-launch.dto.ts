import {
  IsDate,
  IsISO8601,
  IsObject,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateBookDto } from './update-book.dto';
import { UpdateAuthorDto } from './update-author.dto';
import { UpdateLibraryDto } from './update-library.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLaunchDto {
  @IsISO8601()
  readonly bookLaunchDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Please use hh:mm .',
  })
  readonly bookLaunchTime: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateBookDto)
  @ApiProperty({ type: UpdateBookDto })
  readonly launchBook: UpdateBookDto;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateAuthorDto)
  @ApiProperty({ type: UpdateAuthorDto })
  readonly launchAuthor: UpdateAuthorDto;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateLibraryDto)
  @ApiProperty({ type: UpdateLibraryDto })
  readonly launchLibrary: UpdateLibraryDto;
}
// the shape of our object
// typesafety
