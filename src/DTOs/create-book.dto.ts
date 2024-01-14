import { IsDate, IsNumber, IsString } from 'class-validator';
export class CreateBookDto {
  @IsString()
  readonly bookTitle: string;

  //   @IsString({ each: true })
  //   readonly authors: string[];

  @IsString()
  readonly bookDescription: string;

  @IsNumber()
  readonly bookPages: number;

  @IsNumber()
  readonly bookPrice: number;

  @IsNumber()
  readonly bookRating: number;

  @IsDate()
  readonly bookPublishYear: Date;

  @IsNumber()
  readonly bookSales: number;
}
// the shape of our object
// typesafety
