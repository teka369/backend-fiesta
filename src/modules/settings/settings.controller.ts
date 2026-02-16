import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateSettings(@Body() body: { googleMapsEmbedUrl?: string | null; featuredProductId?: string | null }) {
    return this.settingsService.updateSettings({
      googleMapsEmbedUrl: body.googleMapsEmbedUrl ?? null,
      featuredProductId: body.featuredProductId ?? null,
    });
  }
}

