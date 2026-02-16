import { PackageItemDto } from './package-item.dto';
export declare class CreatePackageDto {
    title: string;
    slug?: string;
    description?: string;
    specialPrice: number;
    isActive?: boolean;
    items?: PackageItemDto[];
}
