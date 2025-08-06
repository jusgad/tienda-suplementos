const nextJest = require('next/jest')

// Configuración para crear Jest config que funciona con Next.js
const createJestConfig = nextJest({
  dir: './',
})

// Configuración personalizada de Jest
const customJestConfig = {
  // Entorno de testing
  testEnvironment: 'jest-environment-jsdom',
  
  // Configuración de setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Rutas de módulos
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },
  
  // Directorios a testear
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  
  // Transformaciones
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Mock de archivos estáticos
  moduleNameMapping: {
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/middleware.ts',
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Configuración de reporters
  collectCoverage: false, // Solo activar cuando sea necesario
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: '<rootDir>/coverage',
  
  // Variables de entorno para testing
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Configuración para mocks
  clearMocks: true,
  restoreMocks: true,
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Configuración para archivos específicos
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'jest-environment-jsdom',
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/**/*.integration.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
    },
  ],
}

// Crear configuración final de Jest
module.exports = createJestConfig(customJestConfig)