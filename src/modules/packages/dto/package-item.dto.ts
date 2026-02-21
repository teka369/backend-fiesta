import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PackageItemDto {
  @ApiProperty({
    example: 'uuid-del-producto',
    description: 'ID del producto incluido en el paquete',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad del producto',
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number = 1;
}
