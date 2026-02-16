# Diagrama ERD - E-commerce Administrativo (Backend Fiesta)

## Esquema de entidades y relaciones

```mermaid
erDiagram
    User ||--o{ Product : "gestiona"
    User {
        string id PK
        string email UK
        string password
        string name
        enum role
        datetime createdAt
        datetime updatedAt
    }

    Category ||--o{ Product : "contiene"
    Category {
        string id PK
        string name
        string slug UK
        string description
        string imageUrl
        int sortOrder
        bool isActive
        datetime createdAt
        datetime updatedAt
    }

    Product ||--o{ ProductImage : "tiene"
    Product {
        string id PK
        string title
        string slug UK
        string description
        decimal price
        enum status
        string categoryId FK
        int sortOrder
        bool isActive
        datetime createdAt
        datetime updatedAt
    }

    ProductImage {
        string id PK
        string productId FK
        string url
        string alt
        int sortOrder
        datetime createdAt
    }

    Package ||--o{ PackageProduct : "contiene"
    Product ||--o{ PackageProduct : "incluido_en"
    Package {
        string id PK
        string title
        string slug UK
        string description
        decimal specialPrice
        bool isActive
        datetime createdAt
        datetime updatedAt
    }

    PackageProduct {
        string id PK
        string packageId FK
        string productId FK
        int quantity
        int sortOrder
    }

    ProductStatus {
        DISPONIBLE
        OCUPADO
        VENDIDO
        EN_CAMINO
    }

    UserRole {
        ADMIN
        EDITOR
        VIEWER
    }
```

## Tablas resumidas

| Tabla            | Descripción                                      |
|------------------|--------------------------------------------------|
| `users`          | Usuarios del panel administrativo (Auth)         |
| `categories`     | Categorías; relación 1:N con productos           |
| `products`       | Productos con título, descripción, precio, status|
| `product_images` | Imágenes de productos (N por producto)           |
| `packages`       | Paquetes/bundles con precio especial             |
| `package_products` | N:M entre Package y Product (con quantity)     |

## Enums

- **ProductStatus**: `DISPONIBLE` | `OCUPADO` | `VENDIDO` | `EN_CAMINO`
- **UserRole**: `ADMIN` | `EDITOR` | `VIEWER`

## Flujo WhatsApp / Llamada

Los endpoints de “acción de venta” no persisten en BD; generan en tiempo real:

- **WhatsApp**: `https://wa.me/<PHONE>?text=<mensaje_codificado>` con título, precio y detalles del producto o paquete.
- **Tel**: `tel:<PHONE>` para abrir marcador.

El frontend consumirá endpoints como `GET /products/:id/contact-link?channel=whatsapp|phone` que devuelven la URL lista para usar.
