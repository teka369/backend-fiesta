import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmergencyAdminDto {
  @ApiProperty({
    example: 'a1b2c3d4e5f6... (32+ caracteres)',
    description: 'Token de emergencia del archivo .env (EMERGENCY_TOKEN)',
    minLength: 32,
  })
  @IsString()
  @MinLength(32, { message: 'Token de emergencia inválido' })
  emergencyToken: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Nueva contraseña para el administrador (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'admin@sunnyparty.com',
    description: 'Correo electrónico del administrador (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'Admin Principal',
    description: 'Nombre del administrador (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
