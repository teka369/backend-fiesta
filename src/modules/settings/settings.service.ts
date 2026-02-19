import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import type { Cache } from 'cache-manager';

@Injectable()
export class SettingsService {
  private readonly SETTINGS_ID = 'main';
  private readonly CACHE_KEY = 'site-settings';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSettings() {
    // Try cache first
    const cached = await this.cacheManager.get<typeof this.SETTINGS_ID>(this.CACHE_KEY);
    if (cached) return cached;

    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: this.SETTINGS_ID },
    });
    const result = settings ?? { googleMapsEmbedUrl: null, featuredProductId: null, contactPhone: null };
    
    // Cache for 5 minutes
    await this.cacheManager.set(this.CACHE_KEY, result, 300);
    
    return result;
  }

  async updateSettings(data: { googleMapsEmbedUrl?: string | null; featuredProductId?: string | null; contactPhone?: string | null }) {
    const current = await this.prisma.siteSettings.findUnique({
      where: { id: this.SETTINGS_ID },
    });

    const cleanedUrl =
      'googleMapsEmbedUrl' in data
        ? typeof data.googleMapsEmbedUrl === 'string'
          ? data.googleMapsEmbedUrl.trim() || null
          : null
        : current?.googleMapsEmbedUrl ?? null;

    const cleanedProductId =
      'featuredProductId' in data
        ? typeof data.featuredProductId === 'string'
          ? data.featuredProductId.trim() || null
          : null
        : current?.featuredProductId ?? null;

    const cleanedPhone =
      'contactPhone' in data
        ? typeof data.contactPhone === 'string'
          ? data.contactPhone.trim() || null
          : null
        : current?.contactPhone ?? null;

    const settings = await this.prisma.siteSettings.upsert({
      where: { id: this.SETTINGS_ID },
      update: {
        googleMapsEmbedUrl: cleanedUrl,
        featuredProductId: cleanedProductId,
        contactPhone: cleanedPhone,
      },
      create: {
        id: this.SETTINGS_ID,
        googleMapsEmbedUrl: cleanedUrl,
        featuredProductId: cleanedProductId,
        contactPhone: cleanedPhone,
      },
    });

    // Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);
    
    return settings;
  }
}

