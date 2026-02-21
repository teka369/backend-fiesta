import { IsString, IsOptional, IsNumber, Min, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PackageItemDto } from './package-item.dto';

export class UpdatePackageDto {
  @ApiProperty({
    example: 'Paquete Fiestas Infantiles',
    description: 'Título del paquete',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'paquete-fiestas-infantiles',
    description: 'Slug URL friendly',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Paquete completo para fiestas infantiles',
    description: 'Descripción del paquete',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 350000,
    description: 'Precio especial del paquete',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  specialPrice?: number;

  @ApiProperty({
    example: true,
    description: 'Si el paquete está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: [PackageItemDto],
    description: 'Array de productos incluidos en el paquete',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageItemDto)
  items?: PackageItemDto[];
}
