import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APP_FILTER } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sunny Party Rentals API')
    .setDescription('API para el sistema de alquiler de artículos para fiestas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticación')
    .addTag('Products', 'Gestión de productos')
    .addTag('Categories', 'Gestión de categorías')
    .addTag('Packages', 'Gestión de paquetes')
    .addTag('Settings', 'Configuración del sitio')
    .addTag('Contact', 'Formulario de contacto')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 1. Configuración de CORS (SIEMPRE antes del listen)
  // Incluye localhost para desarrollo y dominios de producción
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',  // Vite dev
        'http://localhost:3000', // Nest dev
        'http://localhost:3001', // alternative dev
        'https://sunnypartyrentalsllc.com',
        'https://www.sunnypartyrentalsllc.com',
        'https://*.vercel.app',  // Vercel preview deployments
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.some(o => origin?.startsWith(o.replace('*', '')) || o === '*')) {
        callback(null, true);
      } else if (origin?.includes('vercel.app') || origin?.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // 3. Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 4. Iniciar el servidor
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();