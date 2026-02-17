import type { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
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
    }>;
    findAll(query: ProductQueryDto): Promise<{
        data: ({
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    uploadImage(file: Express.Multer.File | undefined, req: Request): {
        url: string;
    };
    bulkStatus(dto: BulkStatusDto): Promise<{
        updated: number;
    }>;
    getContactLink(id: string, channel?: 'whatsapp' | 'phone', phone?: string): Promise<{
        url: string;
        label: string;
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
