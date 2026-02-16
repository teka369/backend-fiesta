import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
    findAll(): Promise<({
        items: ({
            product: {
                images: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    alt: string | null;
                    sortOrder: number;
                    productId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                title: string;
                slug: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ProductStatus;
                saleType: import("@prisma/client").$Enums.ProductSaleType;
                categoryId: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            sortOrder: number;
            productId: string;
            quantity: number;
            packageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    sortOrder: number;
                    slug: string;
                    description: string | null;
                    isActive: boolean;
                    imageUrl: string | null;
                } | null;
                images: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    alt: string | null;
                    sortOrder: number;
                    productId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                title: string;
                slug: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ProductStatus;
                saleType: import("@prisma/client").$Enums.ProductSaleType;
                categoryId: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            sortOrder: number;
            productId: string;
            quantity: number;
            packageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreatePackageDto): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                title: string;
                slug: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ProductStatus;
                saleType: import("@prisma/client").$Enums.ProductSaleType;
                categoryId: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            sortOrder: number;
            productId: string;
            quantity: number;
            packageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdatePackageDto): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                title: string;
                slug: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                status: import("@prisma/client").$Enums.ProductStatus;
                saleType: import("@prisma/client").$Enums.ProductSaleType;
                categoryId: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            sortOrder: number;
            productId: string;
            quantity: number;
            packageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
