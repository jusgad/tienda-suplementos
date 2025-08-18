#!/bin/bash

# Vitality Store - Setup Script
# This script sets up the development environment

set -e

echo "🏪 Vitality Store - Setup Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    log_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    log_info "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version must be 18 or higher. Current version: $(node --version)"
        exit 1
    fi
    
    log_success "Node.js $(node --version) is installed"
}

# Create environment files
create_env_files() {
    log_info "Creating environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://vitality_user:vitality_password@localhost:5432/vitality_store_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EOF
        log_success "Created backend/.env"
    else
        log_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
EOF
        log_success "Created frontend/.env"
    else
        log_warning "frontend/.env already exists, skipping..."
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Root dependencies
    if [ -f "package.json" ]; then
        log_info "Installing root dependencies..."
        npm install
        log_success "Root dependencies installed"
    fi
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    log_success "Frontend dependencies installed"
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    log_success "Backend dependencies installed"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Start PostgreSQL with Docker
    log_info "Starting PostgreSQL container..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Run migrations
    log_info "Running database migrations..."
    cd backend
    npm run migrate
    cd ..
    
    # Run seeds
    log_info "Running database seeds..."
    cd backend
    npm run seed
    cd ..
    
    log_success "Database setup completed"
}

# Main setup function
main() {
    echo ""
    log_info "Starting Vitality Store setup..."
    echo ""
    
    # Check prerequisites
    check_docker
    check_node
    
    # Setup project
    create_env_files
    install_dependencies
    setup_database
    
    echo ""
    log_success "Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review and update environment files:"
    echo "   - backend/.env"
    echo "   - frontend/.env"
    echo ""
    echo "2. Start development environment:"
    echo "   npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:3001/api/health"
    echo ""
    log_info "Happy coding! 🚀"
}

# Run main function
main "$@"