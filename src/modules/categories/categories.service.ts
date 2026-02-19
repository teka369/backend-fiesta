import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  private readonly CACHE_KEY = 'categories-all';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private toSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll() {
    // Try cache first
    const cached = await this.cacheManager.get<typeof this.CACHE_KEY>(this.CACHE_KEY);
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    // Cache for 5 minutes
    await this.cacheManager.set(this.CACHE_KEY, categories, 300);

    return categories;
  }

  async findOne(id: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!cat) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ?? this.toSlug(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: finalSlug,
        description: dto.description ?? null,
        imageUrl: dto.imageUrl ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    // Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    let slug: string | undefined;
    if (dto.slug) slug = dto.slug;
    else if (dto.name) {
      slug = this.toSlug(dto.name);
      const existing = await this.prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) slug = `${slug}-${Date.now()}`;
    }
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    // Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);

    return category;
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.prisma.category.delete({ where: { id } });
    
    // Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);
    
    return result;
  }
}
