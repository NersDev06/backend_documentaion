import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let setting = await this.prisma.setting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await this.prisma.setting.create({
        data: {
          id: 'default',
          activeTheme: 'crimson-charcoal',
          viewMode: 'graph',
        },
      });
    }

    return setting;
  }

  async updateSettings(data: { activeTheme?: string; viewMode?: string; customConfig?: string }) {
    return this.prisma.setting.upsert({
      where: { id: 'default' },
      update: {
        ...(data.activeTheme && { activeTheme: data.activeTheme }),
        ...(data.viewMode && { viewMode: data.viewMode }),
        ...(data.customConfig && { customConfig: data.customConfig }),
      },
      create: {
        id: 'default',
        activeTheme: data.activeTheme || 'crimson-charcoal',
        viewMode: data.viewMode || 'graph',
        customConfig: data.customConfig || null,
      },
    });
  }
}
