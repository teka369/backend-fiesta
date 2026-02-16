import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
    } | {
        googleMapsEmbedUrl: null;
    }>;
    updateSettings(body: {
        googleMapsEmbedUrl?: string | null;
    }): Promise<{
        id: string;
        updatedAt: Date;
        googleMapsEmbedUrl: string | null;
    }>;
}
