import { IsArray, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFavouriteDto {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  artists?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  category?: number[];
}
