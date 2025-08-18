# API Documentation - Vitality Store

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.vitality-store.com/api
```

## Authentication

La API utiliza JWT (JSON Web Tokens) para autenticación. Include el token en el header Authorization:

```
Authorization: Bearer <token>
```

## Response Format

Todas las respuestas siguen este formato estándar:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

## Authentication Endpoints

### POST /auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Autentica un usuario existente.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/logout
Cierra la sesión del usuario.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "profileImage": "url",
      "address": {
        "street": "123 Main St",
        "city": "City",
        "state": "State",
        "zipCode": "12345",
        "country": "Country"
      }
    }
  }
}
```

## Product Endpoints

### GET /products
Obtiene lista de productos con filtros y paginación.

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Elementos por página (default: 20, max: 100)
- `category` (optional): Filtrar por categoría
- `brand` (optional): Filtrar por marca
- `featured` (optional): Solo productos destacados (true/false)
- `search` (optional): Búsqueda en nombre y descripción
- `minPrice` (optional): Precio mínimo
- `maxPrice` (optional): Precio máximo
- `sortBy` (optional): Campo para ordenar (name, price, rating, createdAt)
- `sortOrder` (optional): Orden (asc, desc)

**Example Request:**
```
GET /api/products?category=vitamins&featured=true&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Vitamin D3",
        "shortDescription": "High potency vitamin D3",
        "price": 29.99,
        "salePrice": 24.99,
        "currentPrice": 24.99,
        "isOnSale": true,
        "sku": "VIT-D3-001",
        "brand": "Vitality",
        "stock": 100,
        "isInStock": true,
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "alt": "Vitamin D3",
            "isPrimary": true
          }
        ],
        "averageRating": 4.5,
        "reviewCount": 128,
        "tags": ["vitamin", "immunity", "bones"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /products/:id
Obtiene detalles completos de un producto.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Vitamin D3",
      "description": "Full product description...",
      "shortDescription": "High potency vitamin D3",
      "price": 29.99,
      "salePrice": 24.99,
      "currentPrice": 24.99,
      "sku": "VIT-D3-001",
      "brand": "Vitality",
      "stock": 100,
      "images": [...],
      "ingredients": [
        {
          "name": "Vitamin D3",
          "amount": "2000",
          "unit": "IU",
          "dailyValue": 500
        }
      ],
      "nutritionalInfo": {
        "servingSize": "1 capsule",
        "servingsPerContainer": 60
      },
      "specifications": [
        {
          "name": "Form",
          "value": "Capsule"
        }
      ],
      "averageRating": 4.5,
      "reviewCount": 128,
      "relatedProducts": [...]
    }
  }
}
```

### GET /products/:id/reviews
Obtiene reseñas de un producto.

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Elementos por página (default: 10)
- `sortBy` (optional): Campo para ordenar (rating, createdAt)
- `sortOrder` (optional): Orden (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "John D.",
        "rating": 5,
        "title": "Excellent product!",
        "comment": "Really helped with my energy levels...",
        "verified": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

## Category Endpoints

### GET /categories
Obtiene todas las categorías.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Vitamins",
        "slug": "vitamins",
        "description": "Essential vitamins for optimal health",
        "imageUrl": "https://example.com/category.jpg",
        "productCount": 25
      }
    ]
  }
}
```

## Cart Endpoints

### GET /cart
Obtiene el carrito del usuario actual.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "uuid",
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "productName": "Vitamin D3",
          "productImage": "url",
          "quantity": 2,
          "unitPrice": 24.99,
          "totalPrice": 49.98
        }
      ],
      "subtotal": 49.98,
      "taxAmount": 4.50,
      "totalAmount": 54.48,
      "itemCount": 2
    }
  }
}
```

### POST /cart/items
Agrega un producto al carrito.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartItem": {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 24.99,
      "totalPrice": 49.98
    }
  },
  "message": "Product added to cart"
}
```

### PUT /cart/items/:itemId
Actualiza la cantidad de un item en el carrito.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

### DELETE /cart/items/:itemId
Elimina un item del carrito.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### DELETE /cart
Vacía completamente el carrito.

**Headers:** `Authorization: Bearer <token>`

## Order Endpoints

### POST /orders
Crea una nueva orden.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "US",
    "phone": "+1234567890"
  },
  "billingAddress": {
    // Same structure as shippingAddress
  },
  "paymentMethod": "credit_card",
  "paymentToken": "stripe_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-001234",
      "status": "confirmed",
      "items": [...],
      "subtotal": 49.98,
      "taxAmount": 4.50,
      "shippingAmount": 5.99,
      "totalAmount": 60.47,
      "estimatedDelivery": "2024-01-20"
    }
  }
}
```

### GET /orders
Obtiene órdenes del usuario.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Página (default: 1)
- `limit` (optional): Elementos por página (default: 10)
- `status` (optional): Filtrar por estado

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-001234",
        "status": "shipped",
        "totalAmount": 60.47,
        "itemCount": 2,
        "createdAt": "2024-01-15T10:30:00Z",
        "estimatedDelivery": "2024-01-20"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /orders/:id
Obtiene detalles de una orden específica.

**Headers:** `Authorization: Bearer <token>`

## User Profile Endpoints

### PUT /users/profile
Actualiza el perfil del usuario.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### PUT /users/address
Actualiza la dirección del usuario.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "City",
  "state": "State",
  "zipCode": "12345",
  "country": "US"
}
```

### PUT /users/password
Cambia la contraseña del usuario.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newSecurePassword123"
}
```

## Admin Endpoints

*Nota: Todos los endpoints de admin requieren rol de administrador.*

### GET /admin/dashboard
Obtiene métricas del dashboard.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalOrders": 1250,
      "totalRevenue": 125000.50,
      "totalCustomers": 450,
      "totalProducts": 120,
      "ordersToday": 25,
      "revenueToday": 2500.75
    },
    "recentOrders": [...],
    "topProducts": [...]
  }
}
```

### POST /admin/products
Crea un nuevo producto.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "sku": "PRD-001",
  "categoryId": "uuid",
  "brand": "Brand Name",
  "stock": 100
}
```

### PUT /admin/products/:id
Actualiza un producto existente.

### DELETE /admin/products/:id
Elimina un producto.

### GET /admin/orders
Obtiene todas las órdenes (admin).

### PUT /admin/orders/:id/status
Actualiza el estado de una orden.

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Datos de entrada inválidos |
| `AUTHENTICATION_REQUIRED` | Token de autenticación requerido |
| `INVALID_TOKEN` | Token inválido o expirado |
| `INSUFFICIENT_PERMISSIONS` | Permisos insuficientes |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado |
| `DUPLICATE_RESOURCE` | Recurso duplicado |
| `INSUFFICIENT_STOCK` | Stock insuficiente |
| `PAYMENT_FAILED` | Error en el procesamiento del pago |
| `INTERNAL_SERVER_ERROR` | Error interno del servidor |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

## Webhooks

### Stripe Webhook
**POST /webhooks/stripe**

Procesa eventos de Stripe para actualizar estados de pago.

## Health Check

### GET /health
Verifica el estado de la API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600.123,
  "environment": "production",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```