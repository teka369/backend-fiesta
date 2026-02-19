"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    cacheManager;
    SETTINGS_ID = 'main';
    CACHE_KEY = 'site-settings';
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async getSettings() {
        const cached = await this.cacheManager.get(this.CACHE_KEY);
        if (cached)
            return cached;
        const settings = await this.prisma.siteSettings.findUnique({
            where: { id: this.SETTINGS_ID },
        });
        const result = settings ?? { googleMapsEmbedUrl: null, featuredProductId: null, contactPhone: null };
        await this.cacheManager.set(this.CACHE_KEY, result, 300);
        return result;
    }
    async updateSettings(data) {
        const current = await this.prisma.siteSettings.findUnique({
            where: { id: this.SETTINGS_ID },
        });
        const cleanedUrl = 'googleMapsEmbedUrl' in data
            ? typeof data.googleMapsEmbedUrl === 'string'
                ? data.googleMapsEmbedUrl.trim() || null
                : null
            : current?.googleMapsEmbedUrl ?? null;
        const cleanedProductId = 'featuredProductId' in data
            ? typeof data.featuredProductId === 'string'
                ? data.featuredProductId.trim() || null
                : null
            : current?.featuredProductId ?? null;
        const cleanedPhone = 'contactPhone' in data
            ? typeof data.contactPhone === 'string'
                ? data.contactPhone.trim() || null
                : null
            : current?.contactPhone ?? null;
        const settings = await this.prisma.siteSettings.upsert({
            where: { id: this.SETTINGS_ID },
            update: {
                googleMapsEmbedUrl: cleanedUrl,
                featuredProductId: cleanedProductId,
                contactPhone: cleanedPhone,
            },
            create: {
                id: this.SETTINGS_ID,
                googleMapsEmbedUrl: cleanedUrl,
                featuredProductId: cleanedProductId,
                contactPhone: cleanedPhone,
            },
        });
        await this.cacheManager.del(this.CACHE_KEY);
        return settings;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], SettingsService);
//# sourceMappingURL=settings.service.js.map