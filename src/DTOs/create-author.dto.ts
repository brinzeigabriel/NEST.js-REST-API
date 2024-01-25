import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Please use hh:mm.',
  })
  readonly availableStartTime: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Please use hh:mm.',
  })
  readonly availableEndTime: string;
}
// the shape of our object
// typesafety
