import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toSlug;
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        products: {
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
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        description: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
}
