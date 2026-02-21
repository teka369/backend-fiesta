import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Castillos Inflables',
    description: 'Nombre de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'castillos-inflables',
    description: 'Slug URL friendly',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Gran variedad de castles inflables para fiestas',
    description: 'Descripción de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/category-image.jpg',
    description: 'URL de imagen de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: 1,
    description: 'Orden de visualización',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @ApiProperty({
    example: true,
    description: 'Si la categoría está activa',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
