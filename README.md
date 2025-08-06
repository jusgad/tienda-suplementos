# 🌿 Wellness Supplements Platform

Una plataforma especializada de comercio electrónico para suplementos dietéticos que funciona como un "asesor digital de bienestar".

## 🚀 Características Principales

### ✨ Funcionalidades Core
- **Sistema de Autenticación**: AWS Cognito con 2FA
- **Catálogo de Productos**: Filtros avanzados y búsqueda inteligente
- **Cuestionario Personalizado**: Recomendaciones basadas en perfil de salud
- **Carrito y Pagos**: Integración completa con Stripe
- **Seguimiento de Consumo**: Tracking automático con alertas de reposición
- **Panel de Administración**: Gestión completa de productos y pedidos
- **Notificaciones**: Amazon SNS para emails y SMS
- **Logística**: Integración con Amazon FBA

### 🔒 Seguridad
- JWT tokens con expiración automática
- Rate limiting y protección IP
- Headers de seguridad (CSP, HSTS, XSS Protection)
- Autenticación de dos factores (2FA)
- Cifrado de datos sensibles
- Auditoría de eventos de seguridad

### 📊 Analytics y Monitoreo
- Google Analytics 4 con eventos personalizados
- Tracking de conversiones e-commerce
- Métricas de bienestar específicas
- Health check endpoints
- Logging de seguridad

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI/UX**: Tailwind CSS, Framer Motion
- **Autenticación**: AWS Cognito
- **Base de Datos**: Amazon DynamoDB
- **Pagos**: Stripe Elements
- **Notificaciones**: Amazon SNS
- **Logística**: Amazon FBA API
- **Analytics**: Google Analytics 4
- **Hosting**: AWS Amplify

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- AWS Account con permisos para Cognito, DynamoDB, SNS
- Stripe Account
- Google Analytics 4 Property

### Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd wellness-supplements-platform
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuración AWS

### 1. AWS Cognito
```bash
# Crear User Pool
aws cognito-idp create-user-pool \
  --pool-name "wellness-user-pool" \
  --auto-verified-attributes email \
  --mfa-configuration OPTIONAL

# Crear Identity Pool
aws cognito-identity create-identity-pool \
  --identity-pool-name "wellness-identity-pool" \
  --allow-unauthenticated-identities
```

### 2. DynamoDB
```bash
# Crear tablas requeridas
aws dynamodb create-table \
  --table-name wellness-users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Repetir para: wellness-products, wellness-orders, 
# wellness-consumption, wellness-questionnaire-results
```

### 3. Amazon SNS
```bash
# Crear tópico para notificaciones
aws sns create-topic --name wellness-notifications
```

## 🚀 Despliegue con AWS Amplify

### Configuración Automática

1. **Conectar repositorio a Amplify**
   - Ir a AWS Amplify Console
   - Conectar tu repositorio Git
   - Amplify detectará automáticamente `amplify.yml`

2. **Variables de entorno en Amplify**
   ```
   AWS_REGION=us-east-1
   COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
   COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Dominio personalizado** (opcional)
   - Configurar dominio en Amplify Console
   - SSL automático con certificados ACM

### Build Commands
```yaml
# amplify.yml ya configurado con:
- npm install
- npm run build
- Optimizaciones de caché
- Headers de seguridad
- Redirects automáticos
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── checkout/          # Proceso de compra
│   ├── productos/         # Catálogo de productos
│   ├── cuestionario/      # Cuestionario personalizado
│   └── seguimiento/       # Tracking de consumo
├── components/            # Componentes React
│   ├── admin/            # Componentes de admin
│   ├── auth/             # Autenticación
│   ├── checkout/         # Proceso de pago
│   ├── products/         # Catálogo
│   ├── questionnaire/    # Cuestionario
│   └── shared/           # Componentes compartidos
├── hooks/                # React Hooks personalizados
├── lib/                  # Servicios y utilidades
├── types/                # Definiciones TypeScript
└── middleware.ts         # Middleware de seguridad
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run start           # Servidor de producción
npm run lint            # Linting con ESLint
npm run type-check      # Verificación de tipos

# Testing (configurar según necesidades)
npm run test            # Tests unitarios
npm run test:e2e        # Tests end-to-end
```

## 📋 API Endpoints

### Autenticación
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/signin` - Inicio de sesión
- `POST /api/auth/signout` - Cerrar sesión
- `POST /api/auth/2fa/setup` - Configurar 2FA
- `POST /api/auth/2fa/verify` - Verificar 2FA

### Usuarios
- `GET /api/user/profile` - Obtener perfil
- `PUT /api/user/profile` - Actualizar perfil
- `GET /api/user/orders` - Historial de pedidos

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/[id]` - Producto específico
- `GET /api/products/category/[category]` - Por categoría

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/[id]` - Obtener pedido
- `PUT /api/orders/[id]/status` - Actualizar estado

### Cuestionario
- `POST /api/questionnaire/submit` - Enviar respuestas
- `GET /api/questionnaire/results` - Obtener resultados

### Consumo
- `POST /api/consumption` - Registrar consumo
- `GET /api/consumption` - Historial de consumo
- `PUT /api/consumption/[id]` - Actualizar registro

### Admin (requiere permisos)
- `GET /api/admin/dashboard` - Métricas del dashboard
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/[id]` - Actualizar producto
- `GET /api/admin/orders` - Gestión de pedidos

### Sistema
- `GET /api/health` - Health check
- `POST /api/webhooks/stripe` - Webhook de Stripe

## 🔒 Seguridad

### Configuración Implementada
- **Headers de Seguridad**: CSP, HSTS, XSS Protection
- **Rate Limiting**: 100 requests/minuto por IP
- **Autenticación JWT**: Tokens con expiración
- **2FA**: Códigos TOTP con backup codes
- **Cifrado**: AES-256-GCM para datos sensibles
- **Auditoría**: Logging de eventos de seguridad

### Variables Sensibles
```bash
# Nunca commitear en el repositorio:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- STRIPE_SECRET_KEY
- JWT_SECRET
- ENCRYPTION_KEY
```

## 📊 Monitoreo

### Health Checks
```bash
# Verificar estado de la aplicación
curl https://your-domain.com/api/health

# Respuesta esperada:
{
  "status": "ok",
  "services": {
    "database": { "status": "healthy" },
    "api": { "status": "healthy" }
  }
}
```

### Analytics
- **Google Analytics 4**: Tracking automático de eventos
- **Eventos E-commerce**: purchase, add_to_cart, view_item
- **Eventos Custom**: questionnaire_complete, consumption_add
- **Performance**: Core Web Vitals automático

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de autenticación AWS**
   ```bash
   # Verificar credenciales
   aws sts get-caller-identity
   ```

2. **Stripe webhook fallido**
   ```bash
   # Verificar endpoint en Stripe Dashboard
   # URL: https://your-domain.com/api/webhooks/stripe
   ```

3. **Error de CORS**
   ```bash
   # Verificar headers en middleware.ts
   # Añadir dominio a CSP si es necesario
   ```

4. **DynamoDB access denied**
   ```bash
   # Verificar permisos IAM
   # Policy: AmazonDynamoDBFullAccess (desarrollo)
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico:
- 📧 Email: support@wellness-supplements.com
- 📱 WhatsApp: +1-XXX-XXX-XXXX
- 🎫 Issues: GitHub Issues

---

**🌿 Desarrollado con ❤️ para el bienestar digital**