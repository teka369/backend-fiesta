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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("../../common/utils/slugify");
let PackagesService = class PackagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.package.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: { include: { images: true } } },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }
    async findOne(id) {
        const pkg = await this.prisma.package.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: { include: { images: true, category: true } } },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!pkg)
            throw new common_1.NotFoundException(`Paquete con id ${id} no encontrado`);
        return pkg;
    }
    async create(dto) {
        const slug = dto.slug ?? (0, slugify_1.toSlug)(dto.title);
        const existing = await this.prisma.package.findUnique({ where: { slug } });
        const finalSlug = (0, slugify_1.generateUniqueSlugSync)(slug, !!existing);
        return this.prisma.package.create({
            data: {
                title: dto.title,
                slug: finalSlug,
                description: dto.description ?? null,
                specialPrice: dto.specialPrice,
                isActive: dto.isActive ?? true,
                items: dto.items?.length
                    ? {
                        create: dto.items.map((item, i) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            sortOrder: i,
                        })),
                    }
                    : undefined,
            },
            include: {
                items: { include: { product: true } },
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        let slug;
        if (dto.slug)
            slug = dto.slug;
        else if (dto.title) {
            slug = (0, slugify_1.toSlug)(dto.title);
            const existing = await this.prisma.package.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existing)
                slug = (0, slugify_1.generateUniqueSlugSync)(slug, true);
        }
        const data = {
            ...(dto.title && { title: dto.title }),
            ...(slug && { slug }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.specialPrice !== undefined && { specialPrice: dto.specialPrice }),
            ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        };
        if (dto.items) {
            await this.prisma.packageProduct.deleteMany({ where: { packageId: id } });
            data.items = {
                create: dto.items.map((item, i) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    sortOrder: i,
                })),
            };
        }
        return this.prisma.package.update({
            where: { id },
            data,
            include: {
                items: { include: { product: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.package.delete({ where: { id } });
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map