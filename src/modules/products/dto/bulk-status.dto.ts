import { IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { ProductStatus } from '../../../common/enums/product-status.enum';

export class BulkStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsArray()
  @ArrayMinSize(1)
  productIds: string[];
}
