import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus as PrismaProductStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
import { ProductStatus } from '../../common/enums/product-status.enum';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
  ) {}

  private toSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private ensureSlug(dto: CreateProductDto | UpdateProductDto, title?: string): string | undefined {
    const t = 'title' in dto ? dto.title : title;
    if (!t) return undefined;
    return this.toSlug(t);
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug ?? this.toSlug(dto.title);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug: finalSlug,
        description: dto.description,
        price: dto.price,
        status: (dto.status ?? ProductStatus.DISPONIBLE) as PrismaProductStatus,
        saleType: (dto.saleType ?? 'ALQUILABLE') as 'COMPRABLE' | 'ALQUILABLE',
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

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 10, status, categoryId, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as PrismaProductStatus }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    });
    if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    });
    if (!product) throw new NotFoundException(`Producto con slug ${slug} no encontrado`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    const slug = dto.slug ?? (dto.title ? this.toSlug(dto.title) : undefined);
    const updateData: Parameters<typeof this.prisma.product.update>[0]['data'] = {
      ...(dto.title && { title: dto.title }),
      ...(slug && { slug }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.status !== undefined && { status: dto.status as PrismaProductStatus }),
      ...(dto.saleType !== undefined && { saleType: dto.saleType as 'COMPRABLE' | 'ALQUILABLE' }),
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async bulkUpdateStatus(dto: BulkStatusDto) {
    const result = await this.prisma.product.updateMany({
      where: { id: { in: dto.productIds } },
      data: { status: dto.status as PrismaProductStatus },
    });
    return { updated: result.count };
  }

  /**
   * Genera la URL de contacto (WhatsApp o tel) para el producto.
   * El frontend usa esta URL en el botón de acción de venta/renta.
   * Usa el teléfono configurado en SiteSettings (contactPhone).
   */
  async getContactLink(
    id: string,
    channel: 'whatsapp' | 'phone',
    phone?: string,
  ): Promise<{ url: string; label: string }> {
    // Si se pasa teléfono por parámetro, usarlo; si no, obtener de settings
    const settings = await this.settingsService.getSettings();
    const raw = phone ?? (settings as any).contactPhone ?? '';
    const base = raw.replace(/\D/g, '');
    if (!base) {
      return { url: '', label: 'Configurar teléfono en Settings del admin' };
    }
    if (channel === 'phone') {
      return { url: `tel:${base}`, label: 'Llamar' };
    }
    const text = encodeURIComponent(
      `Hola, me interesa el producto con ID: ${id}. ¿Podrían darme más información?`,
    );
    const url = `https://wa.me/${base}?text=${text}`;
    return { url, label: 'Contactar por WhatsApp' };
  }
}
