import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PackagesModule } from './modules/packages/packages.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    PackagesModule,
    SettingsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
