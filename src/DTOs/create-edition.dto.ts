import { IsNotEmpty, IsString } from 'class-validator';
export class CreateEditionDto {
  @IsString()
  @IsNotEmpty()
  readonly editionName: string;
}
// the shape of our object
// typesafety
