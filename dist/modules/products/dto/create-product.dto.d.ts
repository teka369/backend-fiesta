import { ProductStatus } from '../../../common/enums/product-status.enum';
import { ProductSaleType } from '../../../common/enums/product-sale-type.enum';
export declare class ProductImageDto {
    url: string;
    alt?: string;
    sortOrder?: number;
}
export declare class CreateProductDto {
    title: string;
    slug?: string;
    description: string;
    price: number;
    status?: ProductStatus;
    saleType?: ProductSaleType;
    categoryId?: string;
    sortOrder?: number;
    isActive?: boolean;
    images?: ProductImageDto[];
}
