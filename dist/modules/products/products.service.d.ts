import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
import { SettingsService } from '../settings/settings.service';
import type { Cache } from 'cache-manager';
export declare class ProductsService {
    private readonly prisma;
    private readonly settingsService;
    private cacheManager;
    private readonly CACHE_KEY_PREFIX;
    constructor(prisma: PrismaService, settingsService: SettingsService, cacheManager: Cache);
    private toSlug;
    private ensureSlug;
    create(dto: CreateProductDto): Promise<{
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
    findAll(query: ProductQueryDto): Promise<{}>;
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
    update(id: string, dto: UpdateProductDto): Promise<{
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
    bulkUpdateStatus(dto: BulkStatusDto): Promise<{
        updated: number;
    }>;
    getContactLink(id: string, channel: 'whatsapp' | 'phone', phone?: string): Promise<{
        url: string;
        label: string;
    }>;
}
