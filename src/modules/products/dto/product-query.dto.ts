import { IsOptional, IsEnum, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../../../common/enums/product-status.enum';

export class ProductQueryDto {
  @ApiProperty({
    example: 1,
    description: 'Número de página',
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Límite de resultados por página',
    minimum: 1,
    maximum: 500,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    enum: ProductStatus,
    description: 'Filtrar por estado del producto',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    example: 'uuid-de-categoria',
    description: 'Filtrar por ID de categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    example: 'castillo',
    description: 'Buscar en título y descripción',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    enum: ['title', 'price', 'createdAt', 'status'],
    description: 'Campo por el cual ordenar',
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'title' | 'price' | 'createdAt' | 'status';

  @ApiProperty({
    enum: ['asc', 'desc'],
    description: 'Dirección del ordenamiento',
    required: false,
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}
