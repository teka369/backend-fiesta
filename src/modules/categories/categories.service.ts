import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { toSlug, generateUniqueSlugSync } from '../../common/utils/slugify';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
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
    const slug = dto.slug ?? toSlug(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    const finalSlug = generateUniqueSlugSync(slug, !!existing);
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
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    let slug: string | undefined;
    if (dto.slug) slug = dto.slug;
    else if (dto.name) {
      slug = toSlug(dto.name);
      const existing = await this.prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) slug = generateUniqueSlugSync(slug, true);
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
    return category;
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.prisma.category.delete({ where: { id } });
    return result;
  }
}
