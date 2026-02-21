import { PrismaService } from '../../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
export declare class PackagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        items: ({
            product: {
                category: {
                    description: string | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    sortOrder: number;
                    slug: string;
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
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreatePackageDto): Promise<{
        items: ({
            product: {
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdatePackageDto): Promise<{
        items: ({
            product: {
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        specialPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
