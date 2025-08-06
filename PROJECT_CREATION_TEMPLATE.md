# 🚀 Template para Creación de Proyectos E-commerce

## Prompt Base para Nuevos Proyectos

```
Eres un arquitecto de software especializado en crear tiendas virtuales modernas, escalables y centradas en la conversión. Vas a crear un proyecto de e-commerce completo desde cero.

## ESPECIFICACIONES DEL PROYECTO

### Información Básica
- **Tipo de productos**: [ESPECIFICAR: electrónicos, ropa, suplementos, etc.]
- **Mercado objetivo**: [ESPECIFICAR: B2C, B2B, nicho específico]
- **Región**: [ESPECIFICAR: local, nacional, internacional]
- **Volumen esperado**: [ESPECIFICAR: productos, usuarios, transacciones]

### Stack Tecnológico Recomendado
- **Frontend**: Next.js 15+ con App Router
- **Lenguaje**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Estado**: Zustand o Redux Toolkit
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe + PayPal
- **Imágenes**: Cloudinary
- **Deploy**: Vercel + Amazon RDS
- **Analytics**: Google Analytics 4
- **Monitoreo**: Sentry

## ESTRUCTURA DEL PROYECTO

### 📁 Arquitectura de Carpetas
```
src/
├── app/                 # App Router de Next.js
│   ├── (auth)/         # Grupo de rutas de autenticación
│   ├── (shop)/         # Grupo de rutas de la tienda
│   ├── admin/          # Panel administrativo
│   └── api/            # API Routes
├── components/         # Componentes reutilizables
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── forms/         # Componentes de formularios
│   ├── shop/          # Componentes específicos de tienda
│   └── admin/         # Componentes del panel admin
├── lib/               # Utilidades y configuraciones
├── hooks/             # Custom hooks
├── store/             # Gestión de estado
├── types/             # Definiciones de TypeScript
└── utils/             # Funciones de utilidad
```

### 🎯 FUNCIONALIDADES CORE A IMPLEMENTAR

#### 1. GESTIÓN DE PRODUCTOS
- [ ] Catálogo con filtros avanzados
- [ ] Páginas de producto individuales
- [ ] Sistema de categorías y etiquetas
- [ ] Búsqueda con autocomplete
- [ ] Comparador de productos
- [ ] Gestión de inventario en tiempo real

#### 2. CARRITO Y CHECKOUT
- [ ] Carrito persistente (localStorage + DB)
- [ ] Proceso de checkout de un solo paso
- [ ] Múltiples métodos de pago
- [ ] Cálculo de impuestos y envío
- [ ] Cupones y descuentos
- [ ] Checkout de invitado

#### 3. GESTIÓN DE USUARIOS
- [ ] Registro y login
- [ ] Perfiles de usuario
- [ ] Historial de pedidos
- [ ] Lista de deseos
- [ ] Direcciones guardadas
- [ ] Sistema de puntos/fidelidad

#### 4. PANEL ADMINISTRATIVO
- [ ] Dashboard con métricas
- [ ] Gestión de productos
- [ ] Gestión de pedidos
- [ ] Gestión de usuarios
- [ ] Reportes y analytics
- [ ] Configuración de la tienda

#### 5. CARACTERÍSTICAS AVANZADAS
- [ ] Sistema de reseñas y ratings
- [ ] Recomendaciones personalizadas
- [ ] Email marketing automatizado
- [ ] Chat de atención al cliente
- [ ] PWA con notificaciones push
- [ ] Optimización SEO automática

## MEJORES PRÁCTICAS A IMPLEMENTAR

### 🎨 UX/UI Excellence
- **Mobile-first design**: Diseño responsivo perfecto
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Accesibilidad**: WCAG 2.1 AA compliance
- **Micro-interacciones**: Feedback visual inmediato
- **Estados de loading**: Skeleton screens y spinners
- **Error handling**: Mensajes claros y recuperación automática

### ⚡ Rendimiento
- **Optimización de imágenes**: WebP, sizes, lazy loading
- **Code splitting**: Lazy loading de componentes
- **Cache strategy**: ISR, SWR, Redis para datos frecuentes
- **Bundle optimization**: Tree shaking, dead code elimination
- **CDN**: Assets estáticos en CloudFront

### 🔒 Seguridad
- **Validación**: Zod para validación de schemas
- **Sanitización**: XSS protection
- **Rate limiting**: Protección contra ataques
- **HTTPS everywhere**: SSL/TLS en producción
- **PCI compliance**: Para procesamiento de pagos
- **Data encryption**: Datos sensibles encriptados

### 📊 Analytics y Monitoreo
- **Tracking de conversión**: Funnels completos
- **Real User Monitoring**: Performance real de usuarios
- **Error tracking**: Sentry para captura de errores
- **A/B testing**: Feature flags para experimentación
- **SEO monitoring**: Core Web Vitals, rankings

## PROCESO DE DESARROLLO

### Fase 1: Setup y Fundación (1-2 semanas)
1. Configuración inicial del proyecto
2. Setup de base de datos y autenticación
3. Componentes UI base
4. Estructura de routing

### Fase 2: Core Features (3-4 semanas)
1. Gestión de productos
2. Carrito y checkout básico
3. Sistema de usuarios
4. Panel admin básico

### Fase 3: Features Avanzadas (2-3 semanas)
1. Sistema de pagos completo
2. Email notifications
3. Panel admin completo
4. SEO optimization

### Fase 4: Polish y Launch (1-2 semanas)
1. Testing exhaustivo
2. Optimización de performance
3. Security audit
4. Deployment y monitoreo

## INSTRUCCIONES DE USO

### Para crear un nuevo proyecto:
1. **Copia este template** y personaliza según tu negocio
2. **Ejecuta**: "Crea un proyecto de e-commerce siguiendo este template para [TIPO DE NEGOCIO]"
3. **Especifica prioridades**: "Enfócate primero en [FUNCIONALIDADES ESPECÍFICAS]"
4. **Itera por fases**: Desarrolla incrementalmente siguiendo las fases

### Comandos útiles:
- "Crea la estructura inicial del proyecto"
- "Implementa el sistema de [FUNCIONALIDAD]"
- "Optimiza [COMPONENTE] para mejor performance"
- "Añade tests para [FUNCIONALIDAD]"
- "Crea documentación para [SECCIÓN]"

---

**RESULTADO ESPERADO**: Un e-commerce moderno, rápido, seguro y escalable que maximice la conversión y proporcione una excelente experiencia de usuario.
```

## Ejemplos de Personalización

### Para Suplementos (como tu proyecto actual):
```
ESPECIFICAR:
- Tipo de productos: Suplementos alimenticios y productos de bienestar
- Mercado objetivo: B2C, usuarios interesados en salud y fitness
- Características especiales: Cuestionario de salud, seguimiento de consumo, información nutricional
```

### Para Ropa:
```
ESPECIFICAR:
- Tipo de productos: Ropa y accesorios de moda
- Mercado objetivo: B2C, fashion-forward consumers
- Características especiales: Configurador de tallas, lookbooks, seasonal collections
```

¿Te gustaría que implemente alguna mejora específica en tu tienda actual usando estos prompts?