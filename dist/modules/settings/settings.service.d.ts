import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly SETTINGS_ID;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
    } | {
        googleMapsEmbedUrl: null;
    }>;
    updateSettings(data: {
        googleMapsEmbedUrl?: string | null;
    }): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
    }>;
}
