import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PackageItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number = 1;
}
