import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmergencyAdminDto } from './dto/emergency-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string | null;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string | null;
        };
    }>;
    createEmergencyAdmin(dto: EmergencyAdminDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            name: string | null;
        };
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        email: string;
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    private buildToken;
}
