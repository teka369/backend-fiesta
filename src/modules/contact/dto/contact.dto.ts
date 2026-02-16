import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  eventDate?: string;

  @IsString()
  @IsOptional()
  eventType?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
