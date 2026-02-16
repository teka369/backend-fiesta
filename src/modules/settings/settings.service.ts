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
    return settings ?? { googleMapsEmbedUrl: null };
  }

  async updateSettings(data: { googleMapsEmbedUrl?: string | null }) {
    const cleanedUrl =
      typeof data.googleMapsEmbedUrl === 'string'
        ? data.googleMapsEmbedUrl.trim() || null
        : null;

    const settings = await this.prisma.siteSettings.upsert({
      where: { id: this.SETTINGS_ID },
      update: { googleMapsEmbedUrl: cleanedUrl ?? null },
      create: { id: this.SETTINGS_ID, googleMapsEmbedUrl: cleanedUrl ?? null },
    });

    return settings;
  }
}

