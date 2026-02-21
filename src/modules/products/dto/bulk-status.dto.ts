import { IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../../../common/enums/product-status.enum';

export class BulkStatusDto {
  @ApiProperty({
    enum: ProductStatus,
    description: 'Nuevo estado para los productos',
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    description: 'Array de IDs de productos a actualizar',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  productIds: string[];
}
