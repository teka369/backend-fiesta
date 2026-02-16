import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../../../common/enums/product-status.enum';
import { ProductSaleType } from '../../../common/enums/product-sale-type.enum';
import { ProductImageDto } from './create-product.dto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsEnum(ProductSaleType)
  saleType?: ProductSaleType;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
