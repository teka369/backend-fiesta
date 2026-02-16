import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { include: { images: true, category: true } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!pkg) throw new NotFoundException(`Paquete con id ${id} no encontrado`);
    return pkg;
  }

  async create(dto: CreatePackageDto) {
    const slug = dto.slug ?? this.toSlug(dto.title);
    const existing = await this.prisma.package.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
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

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOne(id);
    let slug: string | undefined;
    if (dto.slug) slug = dto.slug;
    else if (dto.title) {
      slug = this.toSlug(dto.title);
      const existing = await this.prisma.package.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) slug = `${slug}-${Date.now()}`;
    }
    const data: Parameters<typeof this.prisma.package.update>[0]['data'] = {
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.package.delete({ where: { id } });
  }
}
