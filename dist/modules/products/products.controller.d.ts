import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
import { ConfigService } from '@nestjs/config';
export declare class ProductsController {
    private readonly productsService;
    private readonly configService;
    constructor(productsService: ProductsService, configService: ConfigService);
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
    findAll(query: ProductQueryDto): Promise<{}>;
    uploadImage(file: Express.Multer.File | undefined): Promise<{
        url: string;
    }>;
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
