import { ProductStatus } from '../../../common/enums/product-status.enum';
import { ProductSaleType } from '../../../common/enums/product-sale-type.enum';
import { ProductImageDto } from './create-product.dto';
export declare class UpdateProductDto {
    title?: string;
    slug?: string;
    description?: string;
    price?: number;
    status?: ProductStatus;
    saleType?: ProductSaleType;
    categoryId?: string;
    sortOrder?: number;
    isActive?: boolean;
    images?: ProductImageDto[];
}
