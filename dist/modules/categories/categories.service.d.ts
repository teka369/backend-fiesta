import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        imageUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        products: {
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
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        imageUrl: string | null;
    }>;
}
