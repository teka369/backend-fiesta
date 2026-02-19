import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    updateSettings(body: {
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
