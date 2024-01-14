import { IsString } from 'class-validator';
export class CreateLibraryDto {
  @IsString()
  readonly libraryName: string;

  @IsString()
  readonly startTime: string;

  @IsString()
  readonly endTime: string;
}
// the shape of our object
// typesafety
