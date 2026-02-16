import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        email: string;
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    updateProfile(req: {
        user: {
            userId: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        email: string;
        name: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
}
