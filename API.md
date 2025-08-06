# 🚀 API Documentation - Wellness Supplements Platform

## 📋 Índice

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Endpoints de Usuario](#endpoints-de-usuario)
4. [Endpoints de Productos](#endpoints-de-productos)
5. [Endpoints de Pedidos](#endpoints-de-pedidos)
6. [Endpoints de Cuestionario](#endpoints-de-cuestionario)
7. [Endpoints de Seguimiento](#endpoints-de-seguimiento)
8. [Endpoints de Administración](#endpoints-de-administración)
9. [Webhooks](#webhooks)
10. [Códigos de Error](#códigos-de-error)
11. [Rate Limiting](#rate-limiting)
12. [Ejemplos de Uso](#ejemplos-de-uso)

## 🎯 Introducción

La API de Wellness Supplements Platform proporciona acceso programático a todas las funcionalidades de la plataforma. Está construida como API REST usando Next.js API Routes y sigue las mejores prácticas de diseño de APIs.

### Base URL
```
Production: https://wellness-supplements.com/api
Staging: https://staging.wellness-supplements.com/api
Development: http://localhost:3000/api
```

### Formato de Respuesta
Todas las respuestas siguen el formato JSON estándar:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Para errores:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔐 Autenticación

### JWT Token Authentication
La API usa JWT tokens para autenticación. Incluye el token en el header `Authorization`:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints de Autenticación

#### `POST /api/auth/signup`
Registrar nuevo usuario.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "SecurePassword123!",
  "name": "Juan Pérez",
  "phone": "+34600123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `POST /api/auth/signin`
Iniciar sesión.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "requiresTwoFactor": false
  }
}
```

#### `POST /api/auth/signout`
Cerrar sesión.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

#### `POST /api/auth/refresh`
Renovar token JWT.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `POST /api/auth/2fa/setup`
Configurar autenticación de dos factores.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "otpauth://totp/WellnessSupplements?secret=JBSWY3DPEHPK3PXP",
    "backupCodes": ["ABC123", "DEF456", "GHI789"]
  }
}
```

#### `POST /api/auth/2fa/verify`
Verificar código 2FA.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA verified successfully"
}
```

## 👤 Endpoints de Usuario

#### `GET /api/user/profile`
Obtener perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "phone": "+34600123456",
    "profile": {
      "age": 30,
      "gender": "male",
      "healthGoals": ["energy-boost", "immune-support"],
      "allergies": ["gluten"],
      "medications": [],
      "preferences": {
        "newsletter": true,
        "notifications": true
      }
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `PUT /api/user/profile`
Actualizar perfil del usuario.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Juan Pérez García",
  "phone": "+34600123457",
  "profile": {
    "age": 31,
    "healthGoals": ["energy-boost", "muscle-building"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Juan Pérez García",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

#### `GET /api/user/orders`
Obtener historial de pedidos del usuario.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Items por página (default: 10)
- `status` (optional): Filtrar por estado

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "status": "delivered",
        "total": 89.97,
        "items": [
          {
            "productId": "prod_001",
            "quantity": 2,
            "price": 29.99
          }
        ],
        "createdAt": "2024-01-10T15:30:00Z",
        "trackingNumber": "TRK123456789"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🛍️ Endpoints de Productos

#### `GET /api/products`
Obtener lista de productos con filtros.

**Query Parameters:**
- `category` (optional): Filtrar por categoría
- `search` (optional): Búsqueda por texto
- `minPrice` (optional): Precio mínimo
- `maxPrice` (optional): Precio máximo
- `sort` (optional): Ordenar por (price_asc, price_desc, rating, name)
- `page` (optional): Número de página
- `limit` (optional): Items por página

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_001",
        "name": "Multivitamínico Premium",
        "description": "Complejo vitamínico completo con 25 nutrientes esenciales",
        "category": "vitaminas",
        "price": 29.99,
        "stock": 150,
        "image": "https://example.com/image.jpg",
        "rating": 4.8,
        "reviews": 1247,
        "ingredients": ["Vitamina A", "Vitamina C", "Vitamina D3"],
        "benefits": ["Aumenta energía", "Fortalece inmunidad"],
        "dosage": "1 cápsula al día con comida",
        "certifications": ["GMP", "FDA Approved"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48
    },
    "filters": {
      "categories": ["vitaminas", "minerales", "omega-3"],
      "priceRange": { "min": 9.99, "max": 89.99 }
    }
  }
}
```

#### `GET /api/products/[id]`
Obtener detalles de un producto específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_001",
    "name": "Multivitamínico Premium",
    "description": "Complejo vitamínico completo con 25 nutrientes esenciales. Formulado para apoyar la energía diaria y el bienestar general.",
    "category": "vitaminas",
    "price": 29.99,
    "stock": 150,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "rating": 4.8,
    "reviews": 1247,
    "ingredients": [
      {
        "name": "Vitamina A",
        "amount": "800mcg",
        "dailyValue": "100%"
      }
    ],
    "nutritionalInfo": {
      "servingSize": "1 cápsula",
      "servingsPerContainer": 60
    },
    "benefits": ["Aumenta energía", "Fortalece inmunidad"],
    "dosage": "1 cápsula al día con comida",
    "warnings": ["Consultar médico si está embarazada"],
    "certifications": ["GMP", "FDA Approved", "Organic"],
    "relatedProducts": ["prod_002", "prod_003"]
  }
}
```

#### `GET /api/products/category/[category]`
Obtener productos por categoría.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "vitaminas",
    "categoryName": "Vitaminas",
    "description": "Suplementos vitamínicos de alta calidad",
    "products": [...],
    "totalProducts": 24
  }
}
```

## 🛒 Endpoints de Pedidos

#### `POST /api/orders`
Crear nuevo pedido.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_001",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "street": "Calle Mayor 123",
    "city": "Madrid",
    "postalCode": "28001",
    "country": "España"
  },
  "paymentMethodId": "pm_1ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "pending",
    "total": 59.98,
    "subtotal": 59.98,
    "tax": 0,
    "shipping": 0,
    "estimatedDelivery": "2024-01-20",
    "paymentIntent": "pi_1ABC123"
  }
}
```

#### `GET /api/orders/[id]`
Obtener detalles de un pedido.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "processing",
    "total": 59.98,
    "items": [
      {
        "productId": "prod_001",
        "productName": "Multivitamínico Premium",
        "quantity": 2,
        "price": 29.99,
        "total": 59.98
      }
    ],
    "shippingAddress": {
      "street": "Calle Mayor 123",
      "city": "Madrid",
      "postalCode": "28001",
      "country": "España"
    },
    "trackingNumber": null,
    "estimatedDelivery": "2024-01-20",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `PUT /api/orders/[id]/cancel`
Cancelar pedido.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "cancelled",
    "refundId": "re_1ABC123"
  }
}
```

## 📋 Endpoints de Cuestionario

#### `POST /api/questionnaire/submit`
Enviar respuestas del cuestionario.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "responses": {
    "age": 30,
    "gender": "male",
    "activityLevel": "moderate",
    "healthGoals": ["energy-boost", "immune-support"],
    "dietaryRestrictions": ["gluten-free"],
    "currentSupplements": ["multivitamin"],
    "healthConcerns": ["fatigue", "stress"],
    "sleepQuality": "fair",
    "stressLevel": "moderate"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resultId": "quest_123",
    "score": 75,
    "recommendations": [
      {
        "productId": "prod_001",
        "product": {
          "id": "prod_001",
          "name": "Multivitamínico Premium",
          "price": 29.99,
          "image": "https://example.com/image.jpg"
        },
        "reason": "Recomendado para aumentar energía y apoyar inmunidad",
        "priority": "high",
        "matchScore": 95
      }
    ],
    "insights": [
      {
        "category": "energy",
        "message": "Tus respuestas indican fatiga. Considera suplementos energéticos.",
        "severity": "medium"
      }
    ]
  }
}
```

#### `GET /api/questionnaire/results`
Obtener historial de resultados de cuestionarios.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "quest_123",
        "score": 75,
        "completedAt": "2024-01-15T10:30:00Z",
        "recommendationsCount": 5
      }
    ]
  }
}
```

#### `GET /api/questionnaire/results/[id]`
Obtener resultado específico de cuestionario.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quest_123",
    "userId": "user_123",
    "responses": { ... },
    "score": 75,
    "recommendations": [ ... ],
    "insights": [ ... ],
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 📊 Endpoints de Seguimiento

#### `GET /api/consumption`
Obtener registros de consumo del usuario.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "cons_123",
        "productId": "prod_001",
        "productName": "Multivitamínico Premium",
        "dailyDose": 1,
        "totalDoses": 60,
        "consumedDoses": 15,
        "startDate": "2024-01-01",
        "estimatedEndDate": "2024-03-01",
        "daysRemaining": 45,
        "adherenceRate": 95,
        "lastTaken": "2024-01-15T08:00:00Z",
        "status": "active"
      }
    ]
  }
}
```

#### `POST /api/consumption`
Registrar nuevo consumo de producto.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "prod_001",
  "dailyDose": 1,
  "totalDoses": 60,
  "startDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cons_123",
    "productId": "prod_001",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `PUT /api/consumption/[id]`
Actualizar registro de consumo.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "consumedDoses": 16,
  "lastTaken": "2024-01-16T08:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cons_123",
    "consumedDoses": 16,
    "daysRemaining": 44,
    "adherenceRate": 96,
    "updatedAt": "2024-01-16T08:15:00Z"
  }
}
```

#### `DELETE /api/consumption/[id]`
Eliminar registro de consumo.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Consumption record deleted successfully"
}
```

## 👨‍💼 Endpoints de Administración

> **Nota:** Todos los endpoints de administración requieren rol de `admin`.

#### `GET /api/admin/dashboard`
Obtener métricas del dashboard.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalUsers": 1250,
      "totalOrders": 3420,
      "totalRevenue": 125430.50,
      "averageOrderValue": 36.67,
      "conversionRate": 2.8,
      "topProducts": [
        {
          "productId": "prod_001",
          "name": "Multivitamínico Premium",
          "sales": 245,
          "revenue": 7355.55
        }
      ]
    },
    "charts": {
      "salesChart": [...],
      "userGrowth": [...],
      "categoryPerformance": [...]
    }
  }
}
```

#### `POST /api/admin/products`
Crear nuevo producto.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Nuevo Suplemento",
  "description": "Descripción del producto",
  "category": "vitaminas",
  "price": 39.99,
  "stock": 100,
  "image": "https://example.com/image.jpg",
  "ingredients": ["Ingrediente 1", "Ingrediente 2"],
  "benefits": ["Beneficio 1", "Beneficio 2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_new_123",
    "name": "Nuevo Suplemento",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `PUT /api/admin/products/[id]`
Actualizar producto existente.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "price": 34.99,
  "stock": 150,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_001",
    "updatedFields": ["price", "stock", "status"],
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

#### `GET /api/admin/orders`
Obtener lista de pedidos para administración.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status`: Filtrar por estado
- `dateFrom`: Fecha desde
- `dateTo`: Fecha hasta
- `page`: Página
- `limit`: Límite por página

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "userId": "user_456",
        "userEmail": "cliente@ejemplo.com",
        "status": "processing",
        "total": 59.98,
        "itemsCount": 2,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### `PUT /api/admin/orders/[id]/status`
Actualizar estado de pedido.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

## 🔗 Webhooks

#### `POST /api/webhooks/stripe`
Webhook de Stripe para eventos de pago.

**Headers:**
- `stripe-signature`: Firma del webhook

**Eventos soportados:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## 🏥 Health Check

#### `GET /api/health`
Verificar estado de la aplicación.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "services": {
      "database": {
        "status": "healthy",
        "responseTime": "45ms"
      },
      "api": {
        "status": "healthy"
      },
      "environment": {
        "nodeEnv": "production",
        "region": "us-east-1"
      }
    }
  }
}
```

## ❌ Códigos de Error

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| `400` | Bad Request | Solicitud malformada |
| `401` | Unauthorized | Token faltante o inválido |
| `403` | Forbidden | Sin permisos suficientes |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto de datos |
| `422` | Validation Error | Error de validación |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error interno del servidor |

### Ejemplo de Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be a valid email address"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🚦 Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **Usuarios autenticados**: 1000 requests/hora
- **Usuarios no autenticados**: 100 requests/hora
- **Endpoints sensibles**: 10 requests/minuto

Headers de respuesta:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248600
```

## 📝 Ejemplos de Uso

### Flujo completo de compra
```javascript
// 1. Autenticarse
const authResponse = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'password123'
  })
});
const { token } = await authResponse.json();

// 2. Obtener productos
const productsResponse = await fetch('/api/products?category=vitaminas');
const products = await productsResponse.json();

// 3. Crear pedido
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{ productId: 'prod_001', quantity: 2, price: 29.99 }],
    shippingAddress: { ... },
    paymentMethodId: 'pm_123'
  })
});
const order = await orderResponse.json();
```

### Cuestionario y recomendaciones
```javascript
// Enviar respuestas del cuestionario
const questionnaireResponse = await fetch('/api/questionnaire/submit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    responses: {
      age: 30,
      gender: 'male',
      healthGoals: ['energy-boost'],
      activityLevel: 'moderate'
    }
  })
});

const { recommendations } = await questionnaireResponse.json();
console.log('Productos recomendados:', recommendations);
```

---

## 📚 Recursos Adicionales

- [Postman Collection](./postman/wellness-supplements-api.json)
- [OpenAPI Specification](./openapi.yaml)
- [SDK JavaScript](./sdk/javascript/)
- [Ejemplos de Integración](./examples/)

---

**📧 Soporte de API:** api-support@wellness-supplements.com  
**📖 Documentación actualizada:** $(date)