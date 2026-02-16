# Estructura de carpetas - Backend Fiesta (NestJS)

```
src/
├── main.ts
├── app.module.ts
│
├── prisma/
│   ├── prisma.module.ts      # Módulo global Prisma
│   └── prisma.service.ts     # Cliente Prisma inyectable
│
├── common/                   # Código compartido
│   ├── enums/
│   │   └── product-status.enum.ts
│   ├── dto/                  # DTOs reutilizables (paginación, etc.)
│   ├── filters/              # Exception filters
│   ├── guards/               # Auth guards
│   └── decorators/
│
└── modules/
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── dto/
    │   ├── strategies/
    │   └── guards/
    │
    ├── products/
    │   ├── products.module.ts
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   ├── dto/
    │   │   ├── create-product.dto.ts
    │   │   ├── update-product.dto.ts
    │   │   └── product-query.dto.ts
    │   └── products.controller.spec.ts
    │
    ├── categories/
    │   ├── categories.module.ts
    │   ├── categories.controller.ts
    │   ├── categories.service.ts
    │   └── dto/
    │
    └── packages/
        ├── packages.module.ts
        ├── packages.controller.ts
        ├── packages.service.ts
        └── dto/

prisma/
├── schema.prisma
└── migrations/

docs/
├── ERD.md
└── ESTRUCTURA-CARPETAS.md
```

## Responsabilidad por módulo

| Módulo      | Responsabilidad                                      |
|------------|-------------------------------------------------------|
| **Auth**   | Login, JWT, roles, protección de rutas admin          |
| **Products** | CRUD productos, imágenes, cambio de estado, contacto (WhatsApp/tel) |
| **Categories** | CRUD categorías, listado para selects                |
| **Packages** | CRUD paquetes, relación N:M con productos, link contacto |

## Endpoints CMS (panel administrativo)

- **Productos**: list (filtros, paginación), get by id, create, update, delete, bulk status update, upload images, contact-link
- **Categorías**: list, get, create, update, delete
- **Paquetes**: list, get, create, update, delete, contact-link
- **Auth**: login, refresh, me
