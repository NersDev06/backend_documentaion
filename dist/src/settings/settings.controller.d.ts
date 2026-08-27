import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        activeTheme: string;
        viewMode: string;
        customConfig: string | null;
        updatedAt: Date;
    }>;
    updateSettings(body: {
        activeTheme?: string;
        viewMode?: string;
        customConfig?: string;
    }): Promise<{
        id: string;
        activeTheme: string;
        viewMode: string;
        customConfig: string | null;
        updatedAt: Date;
    }>;
}
