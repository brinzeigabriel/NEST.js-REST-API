import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false })
  limit: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false })
  offset: number;
}
