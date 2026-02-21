import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard para verificar roles de usuario
 * 
 * Debe usarse después de JwtAuthGuard para asegurar que el usuario está autenticado
 * 
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 * @Delete('products/:id')
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener el usuario de la request (establecido por JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario, denegar acceso
    if (!user) {
      return false;
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}
