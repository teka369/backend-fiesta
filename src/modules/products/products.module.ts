import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule, CacheModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
