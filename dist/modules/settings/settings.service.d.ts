import { PrismaService } from '../../prisma/prisma.service';
import type { Cache } from 'cache-manager';
export declare class SettingsService {
    private readonly prisma;
    private cacheManager;
    private readonly SETTINGS_ID;
    private readonly CACHE_KEY;
    constructor(prisma: PrismaService, cacheManager: Cache);
    getSettings(): Promise<"main" | {
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
        contactPhone: string | null;
    } | {
        googleMapsEmbedUrl: null;
        featuredProductId: null;
        contactPhone: null;
    }>;
    updateSettings(data: {
        googleMapsEmbedUrl?: string | null;
        featuredProductId?: string | null;
        contactPhone?: string | null;
    }): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
        contactPhone: string | null;
    }>;
}
