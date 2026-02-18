import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as fs from 'fs';
import type { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { BulkStatusDto } from './dto/bulk-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed') as unknown as Error, false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'fiesta-products',
          public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as { secure_url: string });
          else reject(new Error('No result from Cloudinary'));
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return { url: result.secure_url };
  }

  @Post('bulk-status')
  @UseGuards(JwtAuthGuard)
  bulkStatus(@Body() dto: BulkStatusDto) {
    return this.productsService.bulkUpdateStatus(dto);
  }

  @Get('contact-link/:id')
  getContactLink(
    @Param('id') id: string,
    @Query('channel') channel: 'whatsapp' | 'phone' = 'whatsapp',
    @Query('phone') phone?: string,
  ) {
    return this.productsService.getContactLink(id, channel, phone);
  }

  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
