import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAuthorDto } from './create-author.dto';
import { Type } from 'class-transformer';
import { CreateEditionDto } from './create-edition.dto';
import { CreateLibraryDto } from './create-library.dto';
import { CreatePublisherDto } from './create-publisher.dto';
export class CreateBookDto {
  @IsString()
  readonly bookTitle: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAuthorDto)
  readonly bookAuthors: CreateAuthorDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEditionDto)
  readonly bookEditions: CreateEditionDto[];

  @IsString()
  readonly bookDescription: string;

  @IsNumber()
  readonly bookPages: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLibraryDto)
  readonly libraries: CreateLibraryDto[];

  @IsNumber()
  readonly bookPrice: number;

  @IsNumber()
  readonly bookRating: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePublisherDto)
  readonly publishers: CreatePublisherDto[];

  @IsDate()
  readonly bookPublishYear: Date;

  @IsNumber()
  readonly bookSales: number;
}
// the shape of our object
// typesafety
