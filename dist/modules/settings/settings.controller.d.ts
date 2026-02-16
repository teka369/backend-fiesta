import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
    } | {
        googleMapsEmbedUrl: null;
        featuredProductId: null;
    }>;
    updateSettings(body: {
        googleMapsEmbedUrl?: string | null;
        featuredProductId?: string | null;
    }): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
        featuredProductId: string | null;
    }>;
}
