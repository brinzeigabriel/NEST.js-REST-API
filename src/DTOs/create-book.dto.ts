import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateAuthorDto } from './create-author.dto';
import { Type } from 'class-transformer';
import { CreateEditionDto } from './create-edition.dto';
import { CreateLibraryDto } from './create-library.dto';
import { CreatePublisherDto } from './create-publisher.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly bookTitle: string;

  @IsString()
  @IsNotEmpty()
  readonly bookDescription: string;

  @IsNumber()
  readonly bookPages: number;

  @IsNumber()
  readonly bookPrice: number;

  @IsNumber()
  readonly bookRating: number;

  @IsString()
  @Length(4, 4, { message: 'bookPublishYear must have exactly 4 digits' })
  readonly bookPublishYear: string;

  @IsNumber()
  readonly bookSales: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAuthorDto)
  @ApiProperty({ type: CreateAuthorDto })
  readonly bookAuthors: CreateAuthorDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEditionDto)
  @ApiProperty({ type: CreateEditionDto })
  readonly bookEditions: CreateEditionDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLibraryDto)
  @ApiProperty({ type: CreateLibraryDto })
  readonly libraries: CreateLibraryDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePublisherDto)
  @ApiProperty({ type: CreatePublisherDto })
  readonly publishers: CreatePublisherDto[];
}
// the shape of our object
// typesafety
