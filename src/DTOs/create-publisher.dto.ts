import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  readonly publisherName: string;
}
// the shape of our object
// typesafety
