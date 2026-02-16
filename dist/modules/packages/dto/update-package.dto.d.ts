import { PackageItemDto } from './package-item.dto';
export declare class UpdatePackageDto {
    title?: string;
    slug?: string;
    description?: string;
    specialPrice?: number;
    isActive?: boolean;
    items?: PackageItemDto[];
}
