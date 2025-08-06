#!/bin/bash

# 🌿 Wellness Supplements Platform - Setup Script
# Este script automatiza la configuración inicial del proyecto

set -e  # Salir si cualquier comando falla

echo "🌿 Iniciando configuración de Wellness Supplements Platform..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar prerrequisitos
check_prerequisites() {
    log "Verificando prerrequisitos..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado. Instala Node.js 18+ desde https://nodejs.org/"
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ requerida. Versión actual: $(node -v)"
    fi
    
    # npm
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
    fi
    
    # AWS CLI (opcional pero recomendado)
    if ! command -v aws &> /dev/null; then
        warn "AWS CLI no está instalado. Instálalo para configuración automática de AWS"
    fi
    
    # Git
    if ! command -v git &> /dev/null; then
        error "Git no está instalado"
    fi
    
    log "✅ Prerrequisitos verificados"
}

# Instalar dependencias
install_dependencies() {
    log "Instalando dependencias..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log "✅ Dependencias instaladas"
}

# Configurar variables de entorno
setup_environment() {
    log "Configurando variables de entorno..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log "📄 Archivo .env.local creado desde .env.example"
            warn "⚠️  IMPORTANTE: Edita .env.local con tus credenciales reales"
        else
            error ".env.example no encontrado"
        fi
    else
        log "📄 .env.local ya existe"
    fi
}

# Verificar estructura de directorios
verify_structure() {
    log "Verificando estructura del proyecto..."
    
    REQUIRED_DIRS=(
        "src/app"
        "src/components"
        "src/hooks"
        "src/lib"
        "src/types"
        "public"
    )
    
    for dir in "${REQUIRED_DIRS[@]}"; do
        if [ ! -d "$dir" ]; then
            error "Directorio requerido no encontrado: $dir"
        fi
    done
    
    log "✅ Estructura del proyecto verificada"
}

# Configurar git hooks (opcional)
setup_git_hooks() {
    log "Configurando Git hooks..."
    
    if [ -d ".git" ]; then
        # Pre-commit hook para linting
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Ejecutando pre-commit checks..."

# Lint
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint failed. Fix issues before committing."
    exit 1
fi

# Type check
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Fix issues before committing."
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF
        
        chmod +x .git/hooks/pre-commit
        log "✅ Git hooks configurados"
    else
        warn "No es un repositorio Git. Saltando configuración de hooks."
    fi
}

# Configurar Husky (si está disponible)
setup_husky() {
    if [ -f "package.json" ] && grep -q "husky" package.json; then
        log "Configurando Husky..."
        npx husky install
        log "✅ Husky configurado"
    fi
}

# Verificar build
test_build() {
    log "Probando build del proyecto..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        log "✅ Build exitoso"
    else
        error "❌ Build falló. Revisa los errores arriba."
    fi
}

# Configurar base de datos local (desarrollo)
setup_local_db() {
    log "Configurando base de datos local para desarrollo..."
    
    # En desarrollo, DynamoDB usa mocks
    # Aquí podrías configurar DynamoDB Local si lo deseas
    warn "💡 En desarrollo se usan mocks de DynamoDB. Para producción configura AWS DynamoDB."
    
    log "✅ Base de datos configurada para desarrollo"
}

# Mostrar información post-instalación
show_info() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    🌿 CONFIGURACIÓN COMPLETA 🌿                ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}✅ El proyecto está configurado y listo para usar${NC}"
    echo ""
    echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
    echo ""
    echo "1. 📝 Editar .env.local con tus credenciales:"
    echo "   - AWS Cognito (User Pool ID, Client ID)"
    echo "   - Stripe (Publishable Key, Secret Key)"
    echo "   - Google Analytics (Measurement ID)"
    echo ""
    echo "2. 🚀 Iniciar servidor de desarrollo:"
    echo "   npm run dev"
    echo ""
    echo "3. 🌐 Abrir en navegador:"
    echo "   http://localhost:3000"
    echo ""
    echo "4. 📚 Leer documentación:"
    echo "   - README.md (documentación general)"
    echo "   - DEPLOYMENT.md (guía de despliegue)"
    echo ""
    echo -e "${YELLOW}🔧 COMANDOS ÚTILES:${NC}"
    echo ""
    echo "  npm run dev          # Servidor de desarrollo"
    echo "  npm run build        # Build de producción"
    echo "  npm run start        # Servidor de producción"
    echo "  npm run lint         # Linting"
    echo "  npm run type-check   # Verificación de tipos"
    echo ""
    echo -e "${YELLOW}🆘 SOPORTE:${NC}"
    echo ""
    echo "  📧 Email: support@wellness-supplements.com"
    echo "  📱 GitHub Issues: https://github.com/tu-repo/issues"
    echo ""
    echo -e "${GREEN}¡Que tengas un excelente desarrollo! 🚀${NC}"
    echo ""
}

# Función principal
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║      🌿 Wellness Supplements Platform - Setup Script        ║"
    echo "║                     Versión 1.0.0                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_prerequisites
    install_dependencies
    setup_environment
    verify_structure
    setup_git_hooks
    setup_husky
    setup_local_db
    
    # Solo hacer build si se pasa el parámetro --with-build
    if [[ "$1" == "--with-build" ]]; then
        test_build
    fi
    
    show_info
}

# Ejecutar función principal con todos los argumentos
main "$@"