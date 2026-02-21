"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sunny Party Rentals API')
        .setDescription('API para el sistema de alquiler de artículos para fiestas')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Auth', 'Endpoints de autenticación')
        .addTag('Products', 'Gestión de productos')
        .addTag('Categories', 'Gestión de categorías')
        .addTag('Packages', 'Gestión de paquetes')
        .addTag('Settings', 'Configuración del sitio')
        .addTag('Contact', 'Formulario de contacto')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:5173',
                'http://localhost:3000',
                'http://localhost:3001',
                'https://sunnypartyrentalsllc.com',
                'https://www.sunnypartyrentalsllc.com',
                'https://*.vercel.app',
            ];
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.some(o => origin?.startsWith(o.replace('*', '')) || o === '*')) {
                callback(null, true);
            }
            else if (origin?.includes('vercel.app') || origin?.includes('localhost')) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map