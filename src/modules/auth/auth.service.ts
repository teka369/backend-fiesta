import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');
    return this.buildToken(user);
  }

  async register(dto: RegisterDto) {
    const userCount = await this.prisma.user.count();
    if (userCount > 0) {
      throw new ForbiddenException('Ya existe una cuenta de administrador. Use iniciar sesión.');
    }
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Ya existe un usuario con ese correo');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name ?? null,
        role: UserRole.ADMIN,
      },
    });
    return this.buildToken(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    if (dto.newPassword) {
      if (!dto.currentPassword) throw new UnauthorizedException('Indique la contraseña actual para cambiar la contraseña');
      const ok = await bcrypt.compare(dto.currentPassword, user.password);
      if (!ok) throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const data: { name?: string; email?: string; password?: string } = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.newPassword) data.password = await bcrypt.hash(dto.newPassword, 10);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true },
    });
    return updated;
  }

  private buildToken(user: { id: string; email: string; role: string; name?: string | null }) {
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
}
