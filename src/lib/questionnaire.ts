export interface Question {
	id: string
	type: 'single' | 'multiple' | 'range' | 'text' | 'number'
	category: string
	question: string
	description?: string
	options?: string[]
	min?: number
	max?: number
	step?: number
	required: boolean
	dependsOn?: {
		questionId: string
		values: string[]
	}
}

export interface QuestionnaireConfig {
	title: string
	description: string
	questions: Question[]
}

export const wellnessQuestionnaire: QuestionnaireConfig = {
	title: 'Cuestionario de Bienestar Personal',
	description: 'Ayúdanos a conocerte mejor para brindarte recomendaciones personalizadas de suplementos que se adapten a tus necesidades específicas.',
	questions: [
		// Información básica
		{
			id: 'age',
			type: 'number',
			category: 'Información Básica',
			question: '¿Cuál es tu edad?',
			min: 18,
			max: 100,
			required: true
		},
		{
			id: 'gender',
			type: 'single',
			category: 'Información Básica',
			question: '¿Cuál es tu género?',
			options: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'],
			required: true
		},
		{
			id: 'weight',
			type: 'number',
			category: 'Información Básica',
			question: '¿Cuál es tu peso aproximado? (kg)',
			min: 40,
			max: 200,
			required: false
		},
		{
			id: 'height',
			type: 'number',
			category: 'Información Básica',
			question: '¿Cuál es tu altura? (cm)',
			min: 140,
			max: 220,
			required: false
		},
		
		// Objetivos de salud
		{
			id: 'health_goals',
			type: 'multiple',
			category: 'Objetivos',
			question: '¿Cuáles son tus principales objetivos de salud y bienestar?',
			description: 'Selecciona todas las opciones que apliquen',
			options: [
				'Aumentar masa muscular',
				'Perder peso',
				'Mejorar energía y vitalidad',
				'Fortalecer sistema inmunológico',
				'Mejorar calidad del sueño',
				'Reducir estrés y ansiedad',
				'Mejorar salud digestiva',
				'Fortalecer huesos y articulaciones',
				'Mejorar salud cardiovascular',
				'Mejorar concentración y memoria',
				'Cuidado de la piel y cabello',
				'Rendimiento deportivo'
			],
			required: true
		},
		
		// Nivel de actividad física
		{
			id: 'activity_level',
			type: 'single',
			category: 'Estilo de Vida',
			question: '¿Cuál describe mejor tu nivel de actividad física?',
			options: [
				'Sedentario (poco o nada de ejercicio)',
				'Ligero (ejercicio ligero 1-3 días/semana)',
				'Moderado (ejercicio moderado 3-5 días/semana)',
				'Activo (ejercicio intenso 6-7 días/semana)',
				'Muy activo (ejercicio muy intenso, trabajo físico)'
			],
			required: true
		},
		
		// Tipo de ejercicio
		{
			id: 'exercise_type',
			type: 'multiple',
			category: 'Estilo de Vida',
			question: '¿Qué tipo de ejercicio practicas regularmente?',
			description: 'Selecciona todas las opciones que apliquen',
			options: [
				'Pesas/Musculación',
				'Cardio (correr, bicicleta, etc.)',
				'Yoga/Pilates',
				'Deportes de equipo',
				'Natación',
				'Crossfit',
				'Artes marciales',
				'Caminata/Senderismo',
				'Baile',
				'No hago ejercicio regularmente'
			],
			required: false,
			dependsOn: {
				questionId: 'activity_level',
				values: ['Ligero (ejercicio ligero 1-3 días/semana)', 'Moderado (ejercicio moderado 3-5 días/semana)', 'Activo (ejercicio intenso 6-7 días/semana)', 'Muy activo (ejercicio muy intenso, trabajo físico)']
			}
		},
		
		// Horarios de comida
		{
			id: 'meal_pattern',
			type: 'single',
			category: 'Alimentación',
			question: '¿Cuál describe mejor tu patrón de alimentación?',
			options: [
				'3 comidas principales al día',
				'3 comidas + 1-2 snacks',
				'5-6 comidas pequeñas al día',
				'Ayuno intermitente',
				'Patrón irregular'
			],
			required: true
		},
		
		// Restricciones dietéticas
		{
			id: 'dietary_restrictions',
			type: 'multiple',
			category: 'Alimentación',
			question: '¿Tienes alguna restricción dietética o alergia?',
			description: 'Selecciona todas las opciones que apliquen',
			options: [
				'Vegetariano',
				'Vegano',
				'Sin gluten',
				'Sin lactosa',
				'Alergia a frutos secos',
				'Alergia al pescado/mariscos',
				'Dieta cetogénica',
				'Dieta paleo',
				'Diabetes',
				'Hipertensión',
				'Ninguna'
			],
			required: true
		},
		
		// Calidad del sueño
		{
			id: 'sleep_quality',
			type: 'range',
			category: 'Bienestar',
			question: '¿Cómo calificarías tu calidad del sueño?',
			description: '1 = Muy mala, 10 = Excelente',
			min: 1,
			max: 10,
			step: 1,
			required: true
		},
		
		// Horas de sueño
		{
			id: 'sleep_hours',
			type: 'range',
			category: 'Bienestar',
			question: '¿Cuántas horas duermes en promedio por noche?',
			min: 4,
			max: 12,
			step: 0.5,
			required: true
		},
		
		// Nivel de estrés
		{
			id: 'stress_level',
			type: 'range',
			category: 'Bienestar',
			question: '¿Cuál es tu nivel de estrés promedio?',
			description: '1 = Muy bajo, 10 = Muy alto',
			min: 1,
			max: 10,
			step: 1,
			required: true
		},
		
		// Problemas de salud específicos
		{
			id: 'health_concerns',
			type: 'multiple',
			category: 'Salud',
			question: '¿Experimentas alguno de estos problemas de salud?',
			description: 'Selecciona todas las opciones que apliquen',
			options: [
				'Fatiga crónica',
				'Problemas digestivos',
				'Dolores articulares',
				'Problemas de piel',
				'Dificultad para concentrarse',
				'Frecuentes resfriados',
				'Problemas de memoria',
				'Cambios de humor',
				'Problemas para dormir',
				'Dolores de cabeza frecuentes',
				'Ninguno'
			],
			required: true
		},
		
		// Experiencia previa con suplementos
		{
			id: 'supplement_experience',
			type: 'single',
			category: 'Experiencia',
			question: '¿Cuál es tu experiencia con suplementos nutricionales?',
			options: [
				'Nunca he tomado suplementos',
				'He tomado algunos ocasionalmente',
				'Tomo suplementos regularmente',
				'Tengo mucha experiencia con suplementos'
			],
			required: true
		},
		
		// Suplementos actuales
		{
			id: 'current_supplements',
			type: 'text',
			category: 'Experiencia',
			question: '¿Qué suplementos tomas actualmente?',
			description: 'Lista los suplementos que tomas regularmente (opcional)',
			required: false,
			dependsOn: {
				questionId: 'supplement_experience',
				values: ['Tomo suplementos regularmente', 'Tengo mucha experiencia con suplementos']
			}
		},
		
		// Presupuesto mensual
		{
			id: 'monthly_budget',
			type: 'single',
			category: 'Preferencias',
			question: '¿Cuál es tu presupuesto mensual aproximado para suplementos?',
			options: [
				'Menos de €30',
				'€30 - €60',
				'€60 - €100',
				'€100 - €150',
				'Más de €150'
			],
			required: true
		}
	]
}

export function getRecommendations(answers: Record<string, any>) {
	const recommendations = []
	
	// Lógica de recomendaciones basada en las respuestas
	const goals = answers.health_goals || []
	const activityLevel = answers.activity_level
	const restrictions = answers.dietary_restrictions || []
	const healthConcerns = answers.health_concerns || []
	
	// Recomendaciones basadas en objetivos
	if (goals.includes('Aumentar masa muscular')) {
		recommendations.push({
			productId: '1',
			reason: 'Ideal para el desarrollo muscular debido a su alto contenido de proteína',
			priority: 'high'
		})
	}
	
	if (goals.includes('Fortalecer sistema inmunológico') || healthConcerns.includes('Frecuentes resfriados')) {
		recommendations.push({
			productId: '2',
			reason: 'Las vitaminas C y D fortalecen el sistema inmunológico',
			priority: 'high'
		})
	}
	
	if (goals.includes('Mejorar salud cardiovascular') || goals.includes('Mejorar concentración y memoria')) {
		recommendations.push({
			productId: '3',
			reason: 'Los omega-3 benefician la salud cardiovascular y cerebral',
			priority: 'medium'
		})
	}
	
	if (goals.includes('Reducir estrés y ansiedad') || goals.includes('Mejorar calidad del sueño') || answers.stress_level >= 7) {
		recommendations.push({
			productId: '4',
			reason: 'El magnesio ayuda a reducir el estrés y mejorar la calidad del sueño',
			priority: 'high'
		})
	}
	
	if (goals.includes('Cuidado de la piel y cabello') || goals.includes('Fortalecer huesos y articulaciones')) {
		recommendations.push({
			productId: '5',
			reason: 'El colágeno mejora la salud de la piel, cabello y articulaciones',
			priority: 'medium'
		})
	}
	
	if (goals.includes('Mejorar salud digestiva') || healthConcerns.includes('Problemas digestivos')) {
		recommendations.push({
			productId: '6',
			reason: 'Los probióticos mejoran la salud digestiva y el equilibrio intestinal',
			priority: 'high'
		})
	}
	
	// Si no hay restricciones y es muy activo, recomendar proteína
	if (activityLevel?.includes('Muy activo') && !restrictions.includes('Vegano')) {
		recommendations.push({
			productId: '1',
			reason: 'Tu alto nivel de actividad requiere mayor ingesta de proteína',
			priority: 'high'
		})
	}
	
	return recommendations
}