# 🏪 Vitality Store

> Tienda online de suplementos deportivos y de bienestar con arquitectura monolítica modular

[![CI/CD Pipeline](https://github.com/tu-usuario/vitality-store/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/tu-usuario/vitality-store/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-18%2B-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18-blue)](https://reactjs.org/)

Una plataforma de comercio electrónico completa, escalable y segura para suplementos deportivos y de bienestar, construida siguiendo una **arquitectura monolítica modular** con separación clara entre frontend y backend.

## 🌟 Características Principales

### 🛍️ Funcionalidades E-commerce
- **Catálogo de productos** con búsqueda avanzada y filtros
- **Carrito de compras** persistente y optimizado
- **Checkout seguro** con integración Stripe
- **Gestión de pedidos** y seguimiento
- **Sistema de reseñas** y calificaciones

### 🎨 Experiencia de Usuario
- **Página de inicio** con banner "Fuel Your Potential"
- **Tienda** con categorías (Vitamins, Minerals, Herbal, Sports Nutrition)
- **Detalle de producto** con información nutricional e ingredientes
- **Blog "The Vitality Hub"** con contenido categorizado
- **Página de contacto** con formulario y mapa
- **Esquema de colores** verde oscuro/negro con acentos naranja

### ⚙️ Panel de Administración
- **Dashboard** con métricas de ventas
- **Gestión de productos** CRUD completo
- **Gestión de usuarios** y roles
- **Gestión de pedidos** y estados
- **Analytics** y reportes

## 🏗️ Arquitectura del Sistema

```
vitality-store/
│
├── 📁 frontend/              # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/    # Componentes organizados por funcionalidad
│   │   ├── 📁 pages/         # Páginas principales
│   │   ├── 📁 hooks/         # Custom hooks
│   │   ├── 📁 context/       # Context API providers
│   │   ├── 📁 services/      # Servicios de API
│   │   └── 📁 utils/         # Utilidades
│   └── 📁 public/            # Assets estáticos
│
├── 📁 backend/               # Node.js/Express API con DDD
│   ├── 📁 src/
│   │   ├── 📁 domain/        # Entidades y lógica de negocio
│   │   ├── 📁 application/   # Casos de uso
│   │   ├── 📁 infrastructure/# DB, HTTP, servicios externos
│   │   └── main.js           # Punto de entrada
│   └── 📁 tests/             # Tests unitarios, integración, E2E
│
├── 📁 database/              # Migraciones y seeds SQL
├── 📁 docker/                # Configuraciones Docker
├── 📁 docs/                  # Documentación completa
├── 📁 scripts/               # Scripts de automatización
└── 📁 .github/workflows/     # CI/CD pipelines
```

## 🚀 Stack Tecnológico

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM 6
- **Estado**: Context API
- **Estilos**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Build**: Create React App

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Arquitectura**: Domain-Driven Design (DDD)
- **Autenticación**: JWT + bcrypt
- **Validación**: Joi
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis 7

### DevOps & Testing
- **Contenedores**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest (70%+ cobertura)
- **Linting**: ESLint + Prettier

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
node --version  # 18+
docker --version
docker-compose --version
```

### Instalación Automática

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/vitality-store.git
cd vitality-store

# Ejecuta el script de configuración
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Instalación Manual

1. **Instalar dependencias**
```bash
npm run install:all
```

2. **Configurar variables de entorno**
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend  
cp frontend/.env.example frontend/.env
```

3. **Iniciar base de datos**
```bash
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

4. **Ejecutar migraciones**
```bash
npm run migrate
npm run seed
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

### URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Inicia frontend y backend
npm run dev:frontend          # Solo frontend
npm run dev:backend           # Solo backend

# Build
npm run build                 # Build completo
npm run build:frontend        # Build frontend
npm run build:backend         # Build backend

# Testing
npm run test                  # Todos los tests
npm run test:unit            # Tests unitarios
npm run test:integration     # Tests de integración
npm run test:e2e             # Tests end-to-end
npm run test:coverage        # Cobertura de tests

# Base de datos
npm run migrate              # Ejecutar migraciones
npm run seed                 # Ejecutar seeds

# Docker
npm run docker:build         # Build imágenes
npm run docker:dev           # Entorno desarrollo
npm run docker:prod          # Entorno producción

# Utilidades
npm run setup                # Configuración inicial
npm run deploy              # Deploy a producción
npm run backup              # Backup de base de datos
```

## 🎨 Páginas Implementadas

### 🏠 Homepage (`/`)
- Header con logo "Vitality Supplements" y navegación
- Banner principal "Fuel Your Potential"
- Sección "Featured Products"
- "Our Mission" y "Customer Testimonials"
- Newsletter signup

### 🛒 Shop Page (`/shop`)
- Filtros por categorías (Vitamins, Minerals, Herbal, etc.)
- Grid de productos con imagen, nombre y precio
- Sistema de paginación y búsqueda
- Ordenamiento por precio, rating, fecha

### 📄 Product Detail (`/product/:id`)
- Galería de imágenes del producto
- Información detallada: overview, ingredientes, especificaciones
- Sistema de reviews con calificaciones
- Productos relacionados
- Botón "Add to Cart"

### 📝 Blog Page (`/blog`)
- "The Vitality Hub Blog" con búsqueda
- Categorías: Featured, Nutrition, Training, Supplements, Wellness
- Grid de artículos con miniaturas
- Sistema de paginación

### 📞 Contact Page (`/contact`)
- Formulario de contacto (Name, Email, Subject, Message)
- Información de contacto de la empresa
- Mapa integrado de ubicación

### 🛒 Cart & Checkout
- Carrito persistente con cálculo de totales
- Proceso de checkout con validación
- Integración con Stripe para pagos
- Confirmación de orden

### 👤 User Pages
- Login y registro de usuarios
- Perfil de usuario editable
- Historial de pedidos
- Gestión de direcciones

### 👨‍💼 Admin Panel
- Dashboard con métricas
- Gestión CRUD de productos
- Gestión de usuarios y roles
- Gestión de pedidos
- Analytics y reportes

## 🧪 Testing

La aplicación cuenta con una suite completa de testing:

### Estructura de Tests
```
backend/tests/
├── unit/                     # Tests unitarios
│   ├── domain/              # Entidades y value objects
│   └── use-cases/           # Casos de uso
├── integration/             # Tests de integración
└── e2e/                     # Tests end-to-end

frontend/tests/
├── components/              # Tests de componentes
├── hooks/                   # Tests de custom hooks
└── pages/                   # Tests de páginas
```

### Cobertura de Pruebas
- **Objetivo**: 70% mínimo de cobertura
- **Tests unitarios**: Lógica de negocio y componentes
- **Tests de integración**: API endpoints y flows
- **Tests E2E**: Workflows completos de usuario

```bash
npm run test:coverage        # Ver reporte de cobertura
```

## 🚀 Deployment

### Desarrollo con Docker

```bash
# Levantar entorno completo
docker-compose -f docker-compose.dev.yml up

# Solo servicios específicos
docker-compose -f docker-compose.dev.yml up postgres redis
```

### Producción

```bash
# Build y deploy de producción
docker-compose -f docker-compose.prod.yml up --build
```

### CI/CD Pipeline

El proyecto incluye pipelines automatizados:

- ✅ **Lint y type checking**
- ✅ **Tests unitarios y de integración**
- ✅ **Build y validation**
- ✅ **Seguridad y vulnerabilidades**
- ✅ **Deploy automático**

## 📊 Funcionalidades Detalladas

### 🔐 Autenticación y Seguridad
- JWT tokens con expiración automática
- Hashing seguro de contraseñas (bcrypt)
- Middleware de autenticación
- Rate limiting por IP
- Headers de seguridad (Helmet.js)
- Validación de entrada (Joi)

### 🛍️ E-commerce Completo
- Catálogo con búsqueda full-text
- Filtros avanzados por múltiples criterios
- Carrito persistente con session storage
- Checkout con validación en tiempo real
- Procesamiento de pagos con Stripe
- Gestión de inventario automatizada

### 📈 Analytics y Métricas
- Dashboard con KPIs principales
- Tracking de ventas y conversiones
- Análisis de productos más vendidos
- Métricas de usuarios activos
- Reportes exportables

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Guidelines de Desarrollo

- ✅ Seguir convenciones de ESLint
- ✅ Escribir tests para nuevas funcionalidades
- ✅ Mantener cobertura >70%
- ✅ Documentar APIs con JSDoc
- ✅ Seguir principios DDD en backend
- ✅ Componentes React reutilizables

## 📚 Documentación

- 📖 [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- 📖 [API Documentation](docs/API.md)
- 📖 [Deployment Guide](docs/DEPLOYMENT.md)
- 📖 [Testing Guide](docs/TESTING.md)
- 📖 [Contributing Guide](docs/CONTRIBUTING.md)

## 🔒 Seguridad

- ✅ Autenticación JWT segura
- ✅ Validación de entrada estricta
- ✅ Rate limiting configurado
- ✅ Headers de seguridad (CSP, HSTS)
- ✅ Sanitización de datos
- ✅ Audit logs de acciones críticas

## 📈 Performance

- ⚡ Lazy loading de componentes
- ⚡ Code splitting automático
- ⚡ Cache con Redis para consultas frecuentes
- ⚡ Compresión gzip activada
- ⚡ Índices optimizados en BD
- ⚡ Connection pooling

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a DB:**
```bash
docker-compose -f docker-compose.dev.yml up -d postgres
npm run migrate
```

**Problemas con dependencias:**
```bash
npm run setup
# o manualmente:
rm -rf node_modules package-lock.json
npm install
```

**Cache de Docker:**
```bash
docker-compose down
docker system prune -a
npm run docker:build
```

## 📞 Soporte y Contacto

- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/vitality-store/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/vitality-store/discussions)
- 📧 **Email**: soporte@vitality-store.com
- 📖 **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/vitality-store/wiki)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca para interfaces de usuario
- [Express.js](https://expressjs.com/) - Framework web para Node.js
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional
- [Docker](https://www.docker.com/) - Plataforma de contenedores
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Stripe](https://stripe.com/) - Procesamiento de pagos

---

<div align="center">

**⭐ ¡Si este proyecto te fue útil, considera darle una estrella! ⭐**

[🐛 Reportar Bug](https://github.com/tu-usuario/vitality-store/issues) · [🚀 Solicitar Feature](https://github.com/tu-usuario/vitality-store/issues) · [🤝 Contribuir](CONTRIBUTING.md)

**Hecho con ❤️ para la comunidad de desarrolladores**

</div>