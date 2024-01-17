import { IsOptional, IsString } from 'class-validator';
export class CreateLibraryDto {
  @IsString()
  readonly libraryName: string;

  @IsOptional()
  @IsString()
  readonly startTime: string;

  @IsOptional()
  @IsString()
  readonly endTime: string;
}
// the shape of our object
// typesafety
