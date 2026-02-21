import { IsEmail, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'nuevo@email.com',
    description: 'Correo electrónico del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña actual (requerido para cambiar contraseña)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña actual debe tener al menos 6 caracteres' })
  currentPassword?: string;

  @ApiProperty({
    example: 'newpassword456',
    description: 'Nueva contraseña (requiere contraseña actual)',
    required: false,
  })
  @ValidateIf((o) => o.currentPassword)
  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword?: string;
}
