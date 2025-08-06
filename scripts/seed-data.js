#!/usr/bin/env node

/**
 * 🌿 Wellness Supplements Platform - Seed Data Script
 * 
 * Este script crea datos de ejemplo para desarrollo y testing
 */

const DynamoDBService = require('../src/lib/dynamodb').default;

// Datos de ejemplo para productos
const sampleProducts = [
  {
    id: 'prod_001',
    name: 'Multivitamínico Premium',
    description: 'Complejo vitamínico completo con 25 nutrientes esenciales. Formulado para apoyar la energía diaria y el bienestar general.',
    category: 'vitaminas',
    price: 29.99,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    ingredients: ['Vitamina A', 'Vitamina C', 'Vitamina D3', 'Vitamina E', 'Complejo B', 'Zinc', 'Hierro', 'Magnesio'],
    benefits: ['Aumenta energía', 'Fortalece inmunidad', 'Mejora concentración'],
    dosage: '1 cápsula al día con comida',
    warnings: ['Consultar médico si está embarazada', 'No exceder dosis recomendada'],
    certifications: ['GMP', 'FDA Approved', 'Organic'],
    rating: 4.8,
    reviews: 1247,
    tags: ['bestseller', 'daily-wellness']
  },
  {
    id: 'prod_002',
    name: 'Omega-3 Ultra Concentrado',
    description: 'Aceite de pescado purificado con alta concentración de EPA y DHA. Apoya la salud cardiovascular y cerebral.',
    category: 'omega-3',
    price: 34.99,
    stock: 89,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
    ingredients: ['EPA (500mg)', 'DHA (300mg)', 'Aceite de pescado purificado', 'Vitamina E'],
    benefits: ['Salud cardiovascular', 'Función cerebral', 'Reduce inflamación'],
    dosage: '2 cápsulas al día con comidas',
    warnings: ['Consultar si toma anticoagulantes', 'Puede causar eructos con sabor a pescado'],
    certifications: ['IFOS Certified', 'Sustainably Sourced', 'Mercury Free'],
    rating: 4.7,
    reviews: 892,
    tags: ['heart-health', 'brain-support']
  },
  {
    id: 'prod_003',
    name: 'Probióticos Avanzados 50 Billones',
    description: 'Fórmula probiótica avanzada con 12 cepas diferentes. Apoya la salud digestiva e inmunológica.',
    category: 'probioticos',
    price: 39.99,
    stock: 67,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    ingredients: ['Lactobacillus acidophilus', 'Bifidobacterium lactis', 'Lactobacillus plantarum', 'Prebiótico FOS'],
    benefits: ['Salud digestiva', 'Fortalece inmunidad', 'Mejora absorción nutrientes'],
    dosage: '1 cápsula al día con el estómago vacío',
    warnings: ['Refrigerar después de abrir', 'Consultar médico si tiene condiciones inmunes'],
    certifications: ['Shelf Stable', 'Non-GMO', 'Gluten Free'],
    rating: 4.6,
    reviews: 634,
    tags: ['digestive-health', 'immune-support']
  },
  {
    id: 'prod_004',
    name: 'Colágeno Hidrolizado + Vitamina C',
    description: 'Colágeno tipo I y III con vitamina C para máxima absorción. Apoya piel, cabello, uñas y articulaciones.',
    category: 'colageno',
    price: 44.99,
    stock: 123,
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400',
    ingredients: ['Colágeno hidrolizado bovino (10g)', 'Vitamina C (60mg)', 'Ácido hialurónico', 'Biotina'],
    benefits: ['Piel radiante', 'Cabello fuerte', 'Articulaciones saludables', 'Uñas resistentes'],
    dosage: '1 cucharada (10g) en agua o jugo',
    warnings: ['Sin sabor artificial', 'Puede mezclarse en bebidas calientes o frías'],
    certifications: ['Grass Fed', 'Hydrolyzed', 'Unflavored'],
    rating: 4.9,
    reviews: 2156,
    tags: ['beauty', 'joint-support', 'bestseller']
  },
  {
    id: 'prod_005',
    name: 'Magnesio Glicinato 400mg',
    description: 'Forma quelada de magnesio con alta biodisponibilidad. Apoya la relajación muscular y calidad del sueño.',
    category: 'minerales',
    price: 24.99,
    stock: 98,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    ingredients: ['Magnesio glicinato (400mg)', 'Glicina', 'Celulosa vegetal'],
    benefits: ['Relajación muscular', 'Mejor sueño', 'Reduce estrés', 'Salud ósea'],
    dosage: '2 cápsulas antes de dormir',
    warnings: ['Puede causar somnolencia', 'Comenzar con dosis menor'],
    certifications: ['Chelated Form', 'High Absorption', 'Vegan'],
    rating: 4.5,
    reviews: 743,
    tags: ['sleep-support', 'stress-relief']
  },
  {
    id: 'prod_006',
    name: 'Vitamina D3 + K2 MK7',
    description: 'Sinergia perfecta de vitamina D3 y K2 para máxima absorción de calcio y salud ósea óptima.',
    category: 'vitaminas',
    price: 19.99,
    stock: 187,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400',
    ingredients: ['Vitamina D3 (2000 IU)', 'Vitamina K2 MK7 (100mcg)', 'Aceite MCT'],
    benefits: ['Salud ósea', 'Inmunidad fuerte', 'Absorción de calcio', 'Salud cardiovascular'],
    dosage: '1 cápsula al día con comida grasa',
    warnings: ['Consultar si toma warfarina', 'No exceder dosis recomendada'],
    certifications: ['D3 from Lanolin', 'K2 MK7 Natural', 'Third Party Tested'],
    rating: 4.7,
    reviews: 1089,
    tags: ['bone-health', 'immune-support']
  },
  {
    id: 'prod_007',
    name: 'Ashwagandha KSM-66 600mg',
    description: 'Extracto estandarizado de ashwagandha para manejo del estrés y apoyo suprarrenal natural.',
    category: 'adaptogenos',
    price: 32.99,
    stock: 76,
    image: 'https://images.unsplash.com/photo-1609481615129-33cf02c1bcc7?w=400',
    ingredients: ['Ashwagandha KSM-66 (600mg)', 'Extracto de raíz', 'Cápsula vegetal'],
    benefits: ['Reduce estrés', 'Mejora energía', 'Apoyo cognitivo', 'Balance hormonal'],
    dosage: '1 cápsula dos veces al día',
    warnings: ['Evitar en embarazo', 'Consultar si toma medicamentos tiroideos'],
    certifications: ['KSM-66 Certified', 'Organic', 'Clinical Studies'],
    rating: 4.4,
    reviews: 567,
    tags: ['stress-relief', 'adaptogen']
  },
  {
    id: 'prod_008',
    name: 'Complejo B de Alta Potencia',
    description: 'Todas las vitaminas B en formas activas y biodisponibles. Esencial para energía y función nerviosa.',
    category: 'vitaminas',
    price: 27.99,
    stock: 134,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    ingredients: ['B1, B2, B3, B5, B6, B7, B9, B12', 'Formas metiladas activas', 'Colina', 'Inositol'],
    benefits: ['Aumenta energía', 'Función cerebral', 'Metabolismo saludable', 'Estado de ánimo'],
    dosage: '1 cápsula al día con el desayuno',
    warnings: ['Puede colorear orina de amarillo', 'Tomar con comida'],
    certifications: ['Methylated Forms', 'High Potency', 'Non-GMO'],
    rating: 4.6,
    reviews: 821,
    tags: ['energy-boost', 'brain-support']
  }
];

// Datos de ejemplo para usuarios (para testing)
const sampleUsers = [
  {
    id: 'user_001',
    email: 'admin@wellness-supplements.com',
    name: 'Administrador',
    role: 'admin',
    profile: {
      age: 35,
      gender: 'other',
      healthGoals: ['general-wellness'],
      allergies: [],
      medications: [],
      preferences: {
        newsletter: true,
        notifications: true
      }
    },
    twoFactorEnabled: false
  },
  {
    id: 'user_002',
    email: 'demo@wellness-supplements.com',
    name: 'Usuario Demo',
    role: 'user',
    profile: {
      age: 28,
      gender: 'female',
      healthGoals: ['energy-boost', 'immune-support'],
      allergies: ['gluten'],
      medications: [],
      preferences: {
        newsletter: true,
        notifications: true
      }
    },
    twoFactorEnabled: false
  }
];

// Datos de ejemplo para resultados de cuestionario
const sampleQuestionnaireResults = [
  {
    id: 'quest_001',
    userId: 'user_002',
    responses: {
      age: 28,
      gender: 'female',
      activityLevel: 'moderate',
      healthGoals: ['energy-boost', 'immune-support'],
      dietaryRestrictions: ['gluten-free'],
      currentSupplements: ['multivitamin'],
      healthConcerns: ['fatigue', 'frequent-colds'],
      sleepQuality: 'fair',
      stressLevel: 'moderate'
    },
    score: 75,
    recommendations: [
      {
        productId: 'prod_001',
        reason: 'Multivitamínico completo para energia general',
        priority: 'high'
      },
      {
        productId: 'prod_003',
        reason: 'Probióticos para fortalecer inmunidad',
        priority: 'medium'
      },
      {
        productId: 'prod_005',
        reason: 'Magnesio para mejor calidad de sueño',
        priority: 'medium'
      }
    ],
    completedAt: new Date().toISOString()
  }
];

// Función principal para crear datos
async function seedDatabase() {
  console.log('🌱 Iniciando creación de datos de ejemplo...');

  try {
    // Crear productos
    console.log('📦 Creando productos de ejemplo...');
    for (const product of sampleProducts) {
      try {
        await DynamoDBService.createProduct(product);
        console.log(`✅ Producto creado: ${product.name}`);
      } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
          console.log(`⚠️  Producto ya existe: ${product.name}`);
        } else {
          console.error(`❌ Error creando producto ${product.name}:`, error.message);
        }
      }
    }

    // Crear usuarios de ejemplo
    console.log('\n👥 Creando usuarios de ejemplo...');
    for (const user of sampleUsers) {
      try {
        await DynamoDBService.createUser(user);
        console.log(`✅ Usuario creado: ${user.email}`);
      } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
          console.log(`⚠️  Usuario ya existe: ${user.email}`);
        } else {
          console.error(`❌ Error creando usuario ${user.email}:`, error.message);
        }
      }
    }

    // Crear resultados de cuestionario
    console.log('\n📋 Creando resultados de cuestionario...');
    for (const result of sampleQuestionnaireResults) {
      try {
        await DynamoDBService.saveQuestionnaireResult(result);
        console.log(`✅ Resultado de cuestionario creado para usuario: ${result.userId}`);
      } catch (error) {
        console.error(`❌ Error creando resultado de cuestionario:`, error.message);
      }
    }

    console.log('\n🎉 ¡Datos de ejemplo creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${sampleProducts.length} productos`);
    console.log(`   - ${sampleUsers.length} usuarios`);
    console.log(`   - ${sampleQuestionnaireResults.length} resultados de cuestionario`);
    
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Admin: admin@wellness-supplements.com');
    console.log('   Demo:  demo@wellness-supplements.com');
    console.log('   (Las contraseñas deben configurarse en AWS Cognito)');

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

// Función para limpiar datos
async function clearDatabase() {
  console.log('🗑️  Limpiando base de datos...');
  console.log('⚠️  Esta funcionalidad requiere implementación adicional');
  console.log('   Para limpiar datos, usa la consola de AWS DynamoDB');
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🌿 Wellness Supplements Platform - Seed Data Script

Uso:
  node scripts/seed-data.js [comando]

Comandos:
  seed    - Crear datos de ejemplo (por defecto)
  clear   - Limpiar base de datos
  help    - Mostrar esta ayuda

Ejemplos:
  npm run seed              # Crear datos de ejemplo
  node scripts/seed-data.js seed
  node scripts/seed-data.js clear
  node scripts/seed-data.js help

Nota: Asegúrate de que las variables de entorno estén configuradas
      correctamente en .env.local para conectar con DynamoDB.
`);
}

// Ejecutar según comando
const command = process.argv[2] || 'seed';

switch (command) {
  case 'seed':
    seedDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  case 'help':
    showHelp();
    break;
  default:
    console.error(`❌ Comando desconocido: ${command}`);
    showHelp();
    process.exit(1);
}

module.exports = {
  sampleProducts,
  sampleUsers,
  sampleQuestionnaireResults,
  seedDatabase,
  clearDatabase
};