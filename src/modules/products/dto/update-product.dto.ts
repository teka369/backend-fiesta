import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../../../common/enums/product-status.enum';
import { ProductSaleType } from '../../../common/enums/product-sale-type.enum';
import { ProductImageDto } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Castillo Inflable Premium',
    description: 'Título del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'castillo-inflable-premium',
    description: 'Slug URL friendly',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Castillo inflable de 6x6 metros ideal para fiestas infantiles',
    description: 'Descripción del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 150000,
    description: 'Precio del producto',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    enum: ProductStatus,
    description: 'Estado del producto',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    enum: ProductSaleType,
    description: 'Tipo de venta (alquiler o venta)',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductSaleType)
  saleType?: ProductSaleType;

  @ApiProperty({
    example: 'uuid-de-categoria',
    description: 'ID de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    example: 1,
    description: 'Orden de visualización',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    example: true,
    description: 'Si el producto está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: [ProductImageDto],
    description: 'Array de imágenes del producto',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
