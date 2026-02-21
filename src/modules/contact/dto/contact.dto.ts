import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del contacto',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del contacto',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+573001234567',
    description: 'Teléfono de contacto (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '2024-12-25',
    description: 'Fecha del evento (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  eventDate?: string;

  @ApiProperty({
    example: 'Cumpleaños infantil',
    description: 'Tipo de evento (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  eventType?: string;

  @ApiProperty({
    example: 'Quiero información sobre el castillo inflable para el cumpleaños de mi hijo',
    description: 'Mensaje del contacto',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
