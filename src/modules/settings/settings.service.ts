import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly SETTINGS_ID = 'main';

  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: this.SETTINGS_ID },
    });
    return settings ?? { googleMapsEmbedUrl: null, featuredProductId: null, contactPhone: null };
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

    return settings;
  }
}

