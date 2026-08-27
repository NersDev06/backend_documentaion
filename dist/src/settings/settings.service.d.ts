import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        activeTheme: string;
        viewMode: string;
        customConfig: string | null;
        updatedAt: Date;
    }>;
    updateSettings(data: {
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
