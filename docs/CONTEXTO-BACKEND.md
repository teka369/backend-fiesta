# Contexto del backend – qué hay, qué falta, cómo comprobarlo

Resumen para verificar que se cumple lo que pediste al inicio y qué falta por hacer.

---

## Lo que pediste al principio

| Requisito | Estado | Dónde comprobarlo |
|-----------|--------|-------------------|
| **Framework: NestJS + TypeScript** | ✅ Hecho | `package.json`, `src/*.ts` |
| **DB: PostgreSQL + Prisma** | ✅ Hecho | `prisma/schema.prisma`, `.env` con `DATABASE_URL` |
| **Arquitectura por módulos (Products, Categories, Packages, Auth)** | ✅ Estructura creada | `src/modules/{products,categories,packages,auth}/` |
| **Productos: CRUD completo** | ✅ Hecho | Módulo Products (ver abajo) |
| **Productos: título, descripción rica (HTML/Markdown), precio, múltiples imágenes, status (disponible, ocupado, vendido, en camino)** | ✅ Hecho | Prisma: `Product`, `ProductImage`, enum `ProductStatus`; DTOs y servicio |
| **Categorías: relación 1:N con productos** | ✅ En modelo | Prisma: `Category` → `Product[]`; **sin endpoints** (módulo vacío) |
| **Paquetes (Bundles): agrupar productos con precio especial** | ✅ En modelo | Prisma: `Package`, `PackageProduct`; **sin endpoints** (módulo vacío) |
| **Flujo venta/renta: link WhatsApp o llamada con detalles** | ✅ Hecho (solo producto) | `GET /products/contact-link/:id?channel=whatsapp\|phone&phone=...` |
| **Panel admin (CMS): endpoints para gestión intuitiva** | ⚠️ Parcial | Products: sí; Categories/Packages: no |
| **CMS: carga de imágenes** | ❌ No hecho | No hay `POST /products/:id/images` ni upload con multer |
| **CMS: cambio de estados masivo** | ✅ Hecho | `POST /products/bulk-status` con `{ status, productIds }` |
| **CMS: gestión de inventario** | ⚠️ Implícito | Productos tienen status; no hay “stock” numérico ni reservas |
| **ERD (esquema BD)** | ✅ Hecho | `docs/ERD.md` |
| **Estructura de carpetas NestJS** | ✅ Hecho | `docs/ESTRUCTURA-CARPETAS.md`, `src/` |
| **Ejemplo servicio + controlador Products** | ✅ Hecho | `src/modules/products/*` |

---

## Qué puede hacer este backend ahora

### Productos (`/products`)

- **POST /** – Crear producto (title, description, price, status, categoryId, images[] con url/alt/sortOrder).
- **GET /** – Listar con paginación y filtros: `?page=1&limit=10&status=DISPONIBLE&categoryId=...&search=...&sortBy=title|price|createdAt|status&sortOrder=asc|desc`.
- **GET /:id** – Obtener uno por id.
- **GET /by-slug/:slug** – Obtener por slug.
- **PATCH /:id** – Actualizar (todos los campos opcionales).
- **DELETE /:id** – Borrar (y sus imágenes por cascade).
- **POST /bulk-status** – Cambio masivo: body `{ "status": "VENDIDO", "productIds": ["id1","id2"] }`.
- **GET /contact-link/:id** – Link para WhatsApp o teléfono: `?channel=whatsapp|phone&phone=+34...` (si no pasas `phone`, usa `CONTACT_PHONE` del `.env`).

Las imágenes se gestionan por **URL** en el JSON (create/update). No hay subida de archivos al servidor.

### Base de datos

- PostgreSQL con Prisma.
- Tablas: `users`, `categories`, `products`, `product_images`, `packages`, `package_products`.
- Migraciones: se usó `prisma db push` (no hay carpeta `prisma/migrations` con historial).

### Infra y configuración

- Validación global con `class-validator` (DTOs).
- Variables de entorno con `@nestjs/config` (`.env`).
- Scripts para Arch Linux: instalar/inicializar Postgres y crear usuario/BD (`scripts/setup-postgres-arch.sh`, `scripts/init-postgres-arch.sh`).

---

## Qué no puede hacer (o no está implementado)

1. **Auth**  
   - Módulo existe vacío.  
   - No hay: login, JWT, roles, guards ni protección de rutas.  
   - Cualquiera puede llamar a todos los endpoints.

2. **Categorías**  
   - Modelo y relación en Prisma.  
   - No hay: controller, service ni endpoints (CRUD de categorías).

3. **Paquetes (Bundles)**  
   - Modelo y tabla N:M en Prisma.  
   - No hay: controller, service ni endpoints (CRUD de paquetes ni link de contacto para paquete).

4. **Carga de imágenes**  
   - No hay endpoint de upload (multer).  
   - Solo se guardan URLs en `ProductImage` (por ejemplo desde un CMS externo o URL pública).

5. **Link de contacto para paquetes**  
   - Solo existe para producto (`/products/contact-link/:id`).  
   - No hay `/packages/contact-link/:id` con detalles del paquete.

6. **Inventario “clásico”**  
   - No hay campo de stock numérico ni reservas; solo el status del producto (DISPONIBLE, OCUPADO, VENDIDO, EN_CAMINO).

7. **Migraciones versionadas**  
   - No hay `prisma migrate dev` con historial; solo `db push`.  
   - Para tener migraciones hace falta dar `CREATEDB` al usuario o usar otro flujo.

---

## Cómo comprobar que cumple lo que indicaste

### Requisitos técnicos

- NestJS + TypeScript: `npm run build` y `npm run start:dev`.
- PostgreSQL + Prisma: `.env` con `DATABASE_URL` y `npx prisma db push` ya ejecutado (tablas creadas).

### Productos (CRUD, campos, status, imágenes)

- Crear:  
  `POST http://localhost:3000/products`  
  Body (ejemplo):  
  `{ "title": "Mesas", "description": "<p>Mesas</p>", "price": 100, "status": "DISPONIBLE", "images": [{ "url": "https://ejemplo.com/1.jpg", "alt": "Mesa" }] }`
- Listar: `GET http://localhost:3000/products?page=1&limit=5`.
- Cambio masivo:  
  `POST http://localhost:3000/products/bulk-status`  
  Body: `{ "status": "VENDIDO", "productIds": ["<id>"] }`.
- Link contacto:  
  `GET http://localhost:3000/products/contact-link/<id>?channel=whatsapp&phone=34600000000`.

### Categorías y Paquetes

- En BD existen las tablas y relaciones.
- No hay rutas: si llamas a `/categories` o `/packages` obtendrás 404 (o lo que Nest tenga por defecto).

### Auth

- No hay `/auth/login` ni rutas protegidas; el panel admin no está restringido.

---

## Resumen ejecutivo

- **Cumple**: NestJS, TypeScript, PostgreSQL, Prisma, estructura por módulos, modelo completo (Productos, Categorías, Paquetes, Users), CRUD de productos con todos los campos y status, múltiples imágenes por URL, cambio de estado masivo, link WhatsApp/teléfono para producto, ERD y estructura de carpetas documentadas, ejemplo completo del módulo Products.
- **No cumple o falta**: Auth (login/JWT/guards), CRUD de Categorías, CRUD de Paquetes, endpoint de **carga de imágenes** (upload), link de contacto para **paquetes**, y (opcional) inventario con stock numérico y migraciones versionadas con Prisma.

Con este contexto puedes indicar qué quieres que se implemente a continuación (por ejemplo: Auth, Categories, Packages, upload de imágenes, contact-link para paquetes) y lo vamos cerrando por partes.
