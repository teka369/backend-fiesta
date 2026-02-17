"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const product_status_enum_1 = require("../../common/enums/product-status.enum");
const settings_service_1 = require("../settings/settings.service");
let ProductsService = class ProductsService {
    prisma;
    settingsService;
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    toSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    ensureSlug(dto, title) {
        const t = 'title' in dto ? dto.title : title;
        if (!t)
            return undefined;
        return this.toSlug(t);
    }
    async create(dto) {
        const slug = dto.slug ?? this.toSlug(dto.title);
        const existing = await this.prisma.product.findUnique({ where: { slug } });
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
        const product = await this.prisma.product.create({
            data: {
                title: dto.title,
                slug: finalSlug,
                description: dto.description,
                price: dto.price,
                status: (dto.status ?? product_status_enum_1.ProductStatus.DISPONIBLE),
                saleType: (dto.saleType ?? 'ALQUILABLE'),
                categoryId: dto.categoryId ?? null,
                sortOrder: dto.sortOrder ?? 0,
                isActive: dto.isActive ?? true,
                images: dto.images?.length
                    ? {
                        create: dto.images.map((img, i) => ({
                            url: img.url,
                            alt: img.alt ?? null,
                            sortOrder: img.sortOrder ?? i,
                        })),
                    }
                    : undefined,
            },
            include: { images: true, category: true },
        });
        return product;
    }
    async findAll(query) {
        const { page = 1, limit = 10, status, categoryId, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(status && { status: status }),
            ...(categoryId && { categoryId }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
        });
        if (!product)
            throw new common_1.NotFoundException(`Producto con id ${id} no encontrado`);
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
        });
        if (!product)
            throw new common_1.NotFoundException(`Producto con slug ${slug} no encontrado`);
        return product;
    }
    async update(id, dto) {
        await this.findOne(id);
        const slug = dto.slug ?? (dto.title ? this.toSlug(dto.title) : undefined);
        const updateData = {
            ...(dto.title && { title: dto.title }),
            ...(slug && { slug }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.price !== undefined && { price: dto.price }),
            ...(dto.status !== undefined && { status: dto.status }),
            ...(dto.saleType !== undefined && { saleType: dto.saleType }),
            ...(dto.categoryId !== undefined && { categoryId: dto.categoryId || null }),
            ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
            ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        };
        if (dto.images) {
            await this.prisma.productImage.deleteMany({ where: { productId: id } });
            updateData.images = {
                create: dto.images.map((img, i) => ({
                    url: img.url,
                    alt: img.alt ?? null,
                    sortOrder: img.sortOrder ?? i,
                })),
            };
        }
        return this.prisma.product.update({
            where: { id },
            data: updateData,
            include: { images: true, category: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }
    async bulkUpdateStatus(dto) {
        const result = await this.prisma.product.updateMany({
            where: { id: { in: dto.productIds } },
            data: { status: dto.status },
        });
        return { updated: result.count };
    }
    async getContactLink(id, channel, phone) {
        const settings = await this.settingsService.getSettings();
        const raw = phone ?? settings.contactPhone ?? '';
        const base = raw.replace(/\D/g, '');
        if (!base) {
            return { url: '', label: 'Configurar teléfono en Settings del admin' };
        }
        if (channel === 'phone') {
            return { url: `tel:${base}`, label: 'Llamar' };
        }
        const text = encodeURIComponent(`Hola, me interesa el producto con ID: ${id}. ¿Podrían darme más información?`);
        const url = `https://wa.me/${base}?text=${text}`;
        return { url, label: 'Contactar por WhatsApp' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map