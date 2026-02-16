"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        return this.buildToken(user);
    }
    async register(dto) {
        const userCount = await this.prisma.user.count();
        if (userCount > 0) {
            throw new common_1.ForbiddenException('Ya existe una cuenta de administrador. Use iniciar sesión.');
        }
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Ya existe un usuario con ese correo');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                name: dto.name ?? null,
                role: client_1.UserRole.ADMIN,
            },
        });
        return this.buildToken(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        if (dto.newPassword) {
            if (!dto.currentPassword)
                throw new common_1.UnauthorizedException('Indique la contraseña actual para cambiar la contraseña');
            const ok = await bcrypt.compare(dto.currentPassword, user.password);
            if (!ok)
                throw new common_1.UnauthorizedException('Contraseña actual incorrecta');
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (existing)
                throw new common_1.ConflictException('Ya existe un usuario con ese correo');
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.newPassword)
            data.password = await bcrypt.hash(dto.newPassword, 10);
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, name: true, role: true },
        });
        return updated;
    }
    buildToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name ?? null,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map