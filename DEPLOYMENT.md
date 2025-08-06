# 🚀 Guía de Despliegue - AWS Amplify

Esta guía te llevará paso a paso a través del proceso de despliegue de la plataforma Wellness Supplements en AWS Amplify.

## 📋 Pre-requisitos

### 1. Cuentas y Servicios Requeridos
- [x] Cuenta de AWS con permisos de administrador
- [x] Repositorio Git (GitHub, GitLab, Bitbucket)
- [x] Cuenta de Stripe (para pagos)
- [x] Google Analytics 4 Property

### 2. Verificar Archivos de Configuración
```bash
# Verificar que existen estos archivos:
ls -la amplify.yml
ls -la .env.example
ls -la next.config.js
```

## 🏗️ Paso 1: Configurar Servicios AWS

### 1.1 AWS Cognito - Autenticación
```bash
# Crear User Pool
aws cognito-idp create-user-pool \
  --pool-name "wellness-user-pool" \
  --auto-verified-attributes email \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --mfa-configuration OPTIONAL \
  --device-configuration '{
    "ChallengeRequiredOnNewDevice": true,
    "DeviceOnlyRememberedOnUserPrompt": false
  }' \
  --region us-east-1

# Crear App Client
aws cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_XXXXXXXXX \
  --client-name "wellness-app-client" \
  --generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH ALLOW_USER_SRP_AUTH \
  --region us-east-1

# Crear Identity Pool
aws cognito-identity create-identity-pool \
  --identity-pool-name "wellness-identity-pool" \
  --allow-unauthenticated-identities \
  --cognito-identity-providers ProviderName=cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX,ClientId=XXXXXXXXXXXXXXXXXXXXXXXXXX \
  --region us-east-1
```

### 1.2 DynamoDB - Base de Datos
```bash
# Tabla de Usuarios
aws dynamodb create-table \
  --table-name wellness-users \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=EmailIndex,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla de Productos
aws dynamodb create-table \
  --table-name wellness-products \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=category,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=CategoryIndex,KeySchema=[{AttributeName=category,KeyType=HASH}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla de Pedidos
aws dynamodb create-table \
  --table-name wellness-orders \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla de Consumo
aws dynamodb create-table \
  --table-name wellness-consumption \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla de Resultados de Cuestionario
aws dynamodb create-table \
  --table-name wellness-questionnaire-results \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 1.3 Amazon SNS - Notificaciones
```bash
# Crear tópico para notificaciones
aws sns create-topic \
  --name wellness-notifications \
  --region us-east-1

# Crear tópico para alertas de sistema
aws sns create-topic \
  --name wellness-system-alerts \
  --region us-east-1
```

### 1.4 IAM - Permisos
```bash
# Crear rol para la aplicación
aws iam create-role \
  --role-name WellnessAmplifyRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "amplify.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Adjuntar políticas necesarias
aws iam attach-role-policy \
  --role-name WellnessAmplifyRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
  --role-name WellnessAmplifyRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess

aws iam attach-role-policy \
  --role-name WellnessAmplifyRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonCognitoPowerUser
```

## 🌐 Paso 2: Configurar AWS Amplify

### 2.1 Crear Aplicación en Amplify
```bash
# Opción 1: AWS CLI
aws amplify create-app \
  --name "wellness-supplements-platform" \
  --description "Plataforma de suplementos de bienestar" \
  --repository "https://github.com/tu-usuario/wellness-supplements-platform" \
  --oauth-token "ghp_tu_token_de_github" \
  --iam-service-role-arn "arn:aws:iam::ACCOUNT-ID:role/WellnessAmplifyRole" \
  --environment-variables '{
    "NODE_ENV": "production",
    "AMPLIFY_DIFF_DEPLOY": "false"
  }' \
  --region us-east-1
```

### 2.2 Configurar Variables de Entorno
```bash
# En la consola de Amplify, agregar estas variables:
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DYNAMODB_TABLE_USERS=wellness-users
DYNAMODB_TABLE_PRODUCTS=wellness-products
DYNAMODB_TABLE_ORDERS=wellness-orders
DYNAMODB_TABLE_CONSUMPTION=wellness-consumption
DYNAMODB_TABLE_QUESTIONNAIRE=wellness-questionnaire-results
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:ACCOUNT-ID:wellness-notifications
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
JWT_SECRET=tu_jwt_secret_super_seguro_de_256_bits
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ENCRYPTION_KEY=tu_encryption_key_de_32_caracteres_min
```

### 2.3 Configurar Branch
```bash
# Crear branch de producción
aws amplify create-branch \
  --app-id dXXXXXXXXX \
  --branch-name main \
  --description "Rama principal de producción" \
  --enable-auto-build \
  --environment-variables '{
    "NODE_ENV": "production"
  }' \
  --region us-east-1
```

## 🔧 Paso 3: Configurar Servicios Externos

### 3.1 Stripe - Configuración de Pagos
1. **Crear cuenta Stripe** (si no tienes una)
2. **Configurar webhook**:
   ```
   URL: https://tu-dominio.amplifyapp.com/api/webhooks/stripe
   Eventos: payment_intent.succeeded, payment_intent.payment_failed
   ```
3. **Obtener claves**:
   - Publishable Key: `pk_live_...`
   - Secret Key: `sk_live_...`
   - Webhook Secret: `whsec_...`

### 3.2 Google Analytics 4
1. **Crear propiedad GA4**
2. **Configurar Enhanced Ecommerce**
3. **Obtener Measurement ID**: `G-XXXXXXXXXX`

## 🚀 Paso 4: Despliegue

### 4.1 Push a Repositorio
```bash
# Verificar que todos los archivos están committeados
git add .
git commit -m "feat: configuración completa para despliegue en Amplify"
git push origin main
```

### 4.2 Iniciar Build
```bash
# El build se iniciará automáticamente, o manualmente:
aws amplify start-job \
  --app-id dXXXXXXXXX \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-1
```

### 4.3 Monitorear Build
- Ve a la consola de AWS Amplify
- Selecciona tu aplicación
- Monitorea el progreso en la pestaña "Build settings"

## 🌍 Paso 5: Configurar Dominio (Opcional)

### 5.1 Dominio Personalizado
```bash
# Añadir dominio personalizado
aws amplify create-domain-association \
  --app-id dXXXXXXXXX \
  --domain-name "wellness-supplements.com" \
  --sub-domain-settings '{
    "prefix": "",
    "branchName": "main"
  }' \
  --region us-east-1
```

### 5.2 Configurar DNS
- Apunta tu dominio a los servidores DNS de Amplify
- Amplify manejará automáticamente el certificado SSL

## ✅ Paso 6: Verificación Post-Despliegue

### 6.1 Health Check
```bash
# Verificar que la aplicación está funcionando
curl https://tu-dominio.amplifyapp.com/api/health

# Respuesta esperada:
{
  "status": "ok",
  "services": {
    "database": { "status": "healthy" },
    "api": { "status": "healthy" }
  }
}
```

### 6.2 Tests de Funcionalidad
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Catálogo de productos se carga
- [ ] Carrito de compras funciona
- [ ] Proceso de pago completo
- [ ] Notificaciones se envían
- [ ] Panel de admin accesible

### 6.3 Tests de Seguridad
```bash
# Verificar headers de seguridad
curl -I https://tu-dominio.amplifyapp.com

# Deberías ver:
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## 🔧 Troubleshooting

### Build Failures
```bash
# Ver logs detallados
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/amplify" \
  --region us-east-1

# Ver logs específicos
aws logs get-log-events \
  --log-group-name "/aws/amplify/dXXXXXXXXX/main" \
  --log-stream-name "2024/01/01/build" \
  --region us-east-1
```

### Variables de Entorno
- Verificar que todas las variables están configuradas
- No usar comillas en los valores
- Valores sensibles deben estar en Amplify, no en el código

### Permisos IAM
- Verificar que el rol de Amplify tiene permisos para DynamoDB, SNS, Cognito
- Verificar que las políticas están adjuntadas correctamente

## 📈 Monitoreo y Mantenimiento

### CloudWatch Dashboards
- Crear dashboard para métricas de la aplicación
- Configurar alarmas para errores críticos

### Backup y Recuperación
- DynamoDB: Habilitar backup automático
- Código: Mantener múltiples branches para rollback

### Actualizaciones
- Usar feature branches para cambios
- Hacer merge a main solo después de testing completo
- Configurar staging environment para pruebas

## 🆘 Contacto de Soporte

En caso de problemas durante el despliegue:
- **Email**: devops@wellness-supplements.com
- **Slack**: #deployment-support
- **Documentación**: [Amplify Docs](https://docs.amplify.aws/)

---

**¡Felicidades! 🎉 Tu plataforma Wellness Supplements está ahora desplegada en AWS Amplify.**