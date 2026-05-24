import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive, IsNumber, Min, IsBoolean, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
