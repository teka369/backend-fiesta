import { ProductStatus } from '../../../common/enums/product-status.enum';
export declare class BulkStatusDto {
    status: ProductStatus;
    productIds: string[];
}
