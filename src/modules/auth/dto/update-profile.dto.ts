import { IsEmail, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña actual debe tener al menos 6 caracteres' })
  currentPassword?: string;

  @ValidateIf((o) => o.currentPassword)
  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword?: string;
}
