import { IsString } from 'class-validator';
export class CreateEditionDto {
  @IsString()
  readonly editionName: string;
}
// the shape of our object
// typesafety
