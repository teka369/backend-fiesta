import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly SETTINGS_ID;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
    } | {
        googleMapsEmbedUrl: null;
        featuredProductId: null;
    }>;
    updateSettings(data: {
        googleMapsEmbedUrl?: string | null;
        featuredProductId?: string | null;
    }): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
    }>;
}
