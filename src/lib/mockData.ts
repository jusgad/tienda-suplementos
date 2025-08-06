import { Product } from '@/types'

export const mockProducts: Product[] = [
	{
		id: '1',
		name: 'Proteína Whey Premium',
		description: 'Proteína de suero de alta calidad para el desarrollo muscular y recuperación post-entrenamiento. Rico en aminoácidos esenciales.',
		price: 89.99,
		category: 'Proteínas',
		images: ['/images/protein-whey.jpg', '/images/protein-whey-2.jpg'],
		ingredients: [
			{ name: 'Proteína de Suero', amount: '25g', dailyValue: '50%' },
			{ name: 'Aminoácidos Esenciales', amount: '11g', dailyValue: 'N/A' },
			{ name: 'Leucina', amount: '2.5g', dailyValue: 'N/A' }
		],
		benefits: [
			'Desarrollo muscular',
			'Recuperación post-entrenamiento',
			'Alto valor biológico',
			'Absorción rápida'
		],
		usage: 'Mezclar 1 cucharada (30g) con 250ml de agua o leche. Tomar después del entrenamiento o entre comidas.',
		warnings: ['Contiene lácteos', 'Mantener en lugar fresco y seco'],
		stock: 150,
		rating: 4.8,
		reviewsCount: 324,
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15')
	},
	{
		id: '2',
		name: 'Multivitamínico Completo',
		description: 'Fórmula integral con vitaminas y minerales esenciales para el bienestar general y energía diaria.',
		price: 34.99,
		category: 'Vitaminas',
		images: ['/images/multivitamin.jpg'],
		ingredients: [
			{ name: 'Vitamina A', amount: '900mcg', dailyValue: '100%' },
			{ name: 'Vitamina C', amount: '90mg', dailyValue: '100%' },
			{ name: 'Vitamina D3', amount: '20mcg', dailyValue: '100%' },
			{ name: 'Complejo B', amount: 'Variado', dailyValue: '100%' },
			{ name: 'Hierro', amount: '8mg', dailyValue: '44%' },
			{ name: 'Zinc', amount: '11mg', dailyValue: '100%' }
		],
		benefits: [
			'Energía y vitalidad',
			'Sistema inmunológico',
			'Salud ósea',
			'Función cognitiva'
		],
		usage: 'Tomar 1 cápsula al día con las comidas.',
		warnings: ['No exceder la dosis recomendada', 'Consultar médico si está embarazada'],
		stock: 200,
		rating: 4.6,
		reviewsCount: 189,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-10')
	},
	{
		id: '3',
		name: 'Omega-3 Premium',
		description: 'Ácidos grasos esenciales EPA y DHA de aceite de pescado purificado para la salud cardiovascular y cerebral.',
		price: 54.99,
		category: 'Ácidos Grasos',
		images: ['/images/omega3.jpg'],
		ingredients: [
			{ name: 'EPA', amount: '360mg', dailyValue: 'N/A' },
			{ name: 'DHA', amount: '240mg', dailyValue: 'N/A' },
			{ name: 'Aceite de Pescado', amount: '1000mg', dailyValue: 'N/A' }
		],
		benefits: [
			'Salud cardiovascular',
			'Función cerebral',
			'Reducción de inflamación',
			'Salud ocular'
		],
		usage: 'Tomar 1-2 cápsulas al día con las comidas.',
		warnings: ['Contiene pescado', 'Consultar médico si toma anticoagulantes'],
		stock: 120,
		rating: 4.7,
		reviewsCount: 156,
		createdAt: new Date('2024-01-12'),
		updatedAt: new Date('2024-01-12')
	},
	{
		id: '4',
		name: 'Magnesio + B6',
		description: 'Combinación sinérgica de magnesio y vitamina B6 para reducir el estrés, mejorar el sueño y la función muscular.',
		price: 24.99,
		category: 'Minerales',
		images: ['/images/magnesium.jpg'],
		ingredients: [
			{ name: 'Magnesio', amount: '375mg', dailyValue: '89%' },
			{ name: 'Vitamina B6', amount: '1.4mg', dailyValue: '100%' }
		],
		benefits: [
			'Relajación muscular',
			'Calidad del sueño',
			'Reducción del estrés',
			'Función nerviosa'
		],
		usage: 'Tomar 1 cápsula al día, preferiblemente por la noche.',
		stock: 180,
		rating: 4.5,
		reviewsCount: 203,
		createdAt: new Date('2024-01-08'),
		updatedAt: new Date('2024-01-08')
	},
	{
		id: '5',
		name: 'Colágeno Hidrolizado',
		description: 'Péptidos de colágeno tipo I y III para la salud de la piel, articulaciones y huesos.',
		price: 67.99,
		category: 'Belleza y Piel',
		images: ['/images/collagen.jpg'],
		ingredients: [
			{ name: 'Colágeno Hidrolizado', amount: '10g', dailyValue: 'N/A' },
			{ name: 'Vitamina C', amount: '60mg', dailyValue: '67%' },
			{ name: 'Ácido Hialurónico', amount: '50mg', dailyValue: 'N/A' }
		],
		benefits: [
			'Salud de la piel',
			'Flexibilidad articular',
			'Fortaleza del cabello',
			'Salud ósea'
		],
		usage: 'Mezclar 1 cucharada en agua, jugo o batido. Tomar diariamente.',
		stock: 95,
		rating: 4.9,
		reviewsCount: 278,
		createdAt: new Date('2024-01-20'),
		updatedAt: new Date('2024-01-20')
	},
	{
		id: '6',
		name: 'Probióticos Advanced',
		description: 'Mezcla de 10 cepas probióticas con 50 mil millones de UFC para la salud digestiva e inmunológica.',
		price: 49.99,
		category: 'Digestivos',
		images: ['/images/probiotics.jpg'],
		ingredients: [
			{ name: 'Lactobacillus acidophilus', amount: '10B UFC', dailyValue: 'N/A' },
			{ name: 'Bifidobacterium longum', amount: '8B UFC', dailyValue: 'N/A' },
			{ name: 'Prebióticos (FOS)', amount: '100mg', dailyValue: 'N/A' }
		],
		benefits: [
			'Salud digestiva',
			'Sistema inmunológico',
			'Equilibrio intestinal',
			'Absorción de nutrientes'
		],
		usage: 'Tomar 1 cápsula al día con el estómago vacío.',
		warnings: ['Mantener refrigerado', 'No exceder la dosis recomendada'],
		stock: 75,
		rating: 4.4,
		reviewsCount: 142,
		createdAt: new Date('2024-01-18'),
		updatedAt: new Date('2024-01-18')
	}
]

export const categories = [
	'Todas',
	'Proteínas',
	'Vitaminas',
	'Minerales',
	'Ácidos Grasos',
	'Digestivos',
	'Belleza y Piel',
	'Energía y Rendimiento',
	'Pérdida de Peso'
]