import { IsNotEmpty, IsString, Matches } from 'class-validator';
export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  readonly libraryName: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Please use hh:mm .',
  })
  readonly startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Please use hh:mm .',
  })
  readonly endTime: string;
}
// the shape of our object
// typesafety
