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
