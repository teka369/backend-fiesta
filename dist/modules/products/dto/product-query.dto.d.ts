import { ProductStatus } from '../../../common/enums/product-status.enum';
export declare class ProductQueryDto {
    page?: number;
    limit?: number;
    status?: ProductStatus;
    categoryId?: string;
    search?: string;
    sortBy?: 'title' | 'price' | 'createdAt' | 'status';
    sortOrder?: 'asc' | 'desc';
}
