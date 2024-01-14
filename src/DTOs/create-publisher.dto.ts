import { IsString } from 'class-validator';
export class CreatePublisherDto {
  @IsString()
  readonly publisherName: string;
}
// the shape of our object
// typesafety
