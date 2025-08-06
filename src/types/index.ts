export interface User {
	id: string
	email: string
	firstName: string
	lastName: string
	phone?: string
	createdAt: Date
	updatedAt: Date
	preferences?: UserPreferences
	consumptionHistory?: ConsumptionRecord[]
}

export interface UserPreferences {
	goals: string[]
	restrictions: string[]
	lifestyle: string
	activityLevel: 'low' | 'moderate' | 'high' | 'very_high'
	age: number
	gender: 'male' | 'female' | 'other'
	weight?: number
	height?: number
}

export interface Product {
	id: string
	name: string
	description: string
	price: number
	category: string
	images: string[]
	ingredients: Ingredient[]
	benefits: string[]
	usage: string
	warnings?: string[]
	stock: number
	rating: number
	reviewsCount: number
	createdAt: Date
	updatedAt: Date
}

export interface Ingredient {
	name: string
	amount: string
	dailyValue?: string
}

export interface CartItem {
	productId: string
	quantity: number
	price: number
	product: Product
}

export interface Order {
	id: string
	userId: string
	items: CartItem[]
	total: number
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
	shippingAddress: Address
	paymentMethod: string
	paymentStatus: 'pending' | 'completed' | 'failed'
	createdAt: Date
	updatedAt: Date
	trackingNumber?: string
}

export interface Address {
	street: string
	city: string
	state: string
	zipCode: string
	country: string
}

export interface ConsumptionRecord {
	id: string
	userId: string
	productId: string
	startDate: Date
	endDate?: Date
	dailyDose: number
	totalQuantity: number
	remainingQuantity: number
	replenishmentDate?: Date
	isActive: boolean
}

export interface QuestionnaireAnswer {
	questionId: string
	answer: string | string[] | number
}

export interface QuestionnaireResult {
	answers: QuestionnaireAnswer[]
	recommendations: ProductRecommendation[]
	score: number
	completedAt: Date
}

export interface ProductRecommendation {
	productId: string
	product: Product
	score: number
	reasons: string[]
	priority: 'high' | 'medium' | 'low'
}

export interface Notification {
	id: string
	userId: string
	type: 'replenishment' | 'order_update' | 'recommendation' | 'promotion'
	title: string
	message: string
	isRead: boolean
	createdAt: Date
	actionUrl?: string
}