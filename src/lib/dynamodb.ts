import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
	DynamoDBDocumentClient, 
	PutCommand, 
	GetCommand, 
	QueryCommand, 
	ScanCommand, 
	UpdateCommand, 
	DeleteCommand,
	BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'
import { User, Product, Order, ConsumptionRecord, QuestionnaireResult } from '@/types'

// Configurar cliente DynamoDB
const dynamoClient = new DynamoDBClient({
	region: process.env.AWS_REGION || 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	}
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

// Nombres de las tablas
const TABLES = {
	USERS: process.env.DYNAMODB_TABLE_USERS || 'wellness-users',
	PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS || 'wellness-products',
	ORDERS: process.env.DYNAMODB_TABLE_ORDERS || 'wellness-orders',
	CONSUMPTION: process.env.DYNAMODB_TABLE_CONSUMPTION || 'wellness-consumption',
	QUESTIONNAIRE_RESULTS: process.env.DYNAMODB_TABLE_QUESTIONNAIRE || 'wellness-questionnaire-results'
}

export class DynamoDBService {
	// Métodos genéricos
	private static async executeCommand(command: any, operation: string): Promise<any> {
		try {
			if (process.env.NODE_ENV === 'development') {
				console.log(`🗄️ DynamoDB ${operation} (Dev Mode):`, command.input)
				return this.getMockResponse(operation, command.input)
			}

			const result = await docClient.send(command)
			return result
		} catch (error) {
			console.error(`Error in DynamoDB ${operation}:`, error)
			throw error
		}
	}

	private static getMockResponse(operation: string, input: any): any {
		switch (operation) {
			case 'GET':
				return { Item: { id: input.Key.id, ...input.Key, mockData: true } }
			case 'PUT':
				return { $metadata: { httpStatusCode: 200 } }
			case 'QUERY':
			case 'SCAN':
				return { Items: [], Count: 0, ScannedCount: 0 }
			case 'UPDATE':
				return { Attributes: { ...input.Key, updated: true } }
			case 'DELETE':
				return { $metadata: { httpStatusCode: 200 } }
			default:
				return { success: true }
		}
	}

	// ========== USUARIOS ==========
	static async createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
		const newUser: User = {
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		const command = new PutCommand({
			TableName: TABLES.USERS,
			Item: newUser,
			ConditionExpression: 'attribute_not_exists(id)'
		})

		await this.executeCommand(command, 'PUT')
		return newUser
	}

	static async getUserById(userId: string): Promise<User | null> {
		const command = new GetCommand({
			TableName: TABLES.USERS,
			Key: { id: userId }
		})

		const result = await this.executeCommand(command, 'GET')
		return result.Item as User || null
	}

	static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
		const updateExpression = []
		const expressionAttributeValues: any = {}
		const expressionAttributeNames: any = {}

		Object.entries(updates).forEach(([key, value]) => {
			if (key !== 'id' && value !== undefined) {
				updateExpression.push(`#${key} = :${key}`)
				expressionAttributeNames[`#${key}`] = key
				expressionAttributeValues[`:${key}`] = value
			}
		})

		updateExpression.push('#updatedAt = :updatedAt')
		expressionAttributeNames['#updatedAt'] = 'updatedAt'
		expressionAttributeValues[':updatedAt'] = new Date()

		const command = new UpdateCommand({
			TableName: TABLES.USERS,
			Key: { id: userId },
			UpdateExpression: `SET ${updateExpression.join(', ')}`,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW'
		})

		const result = await this.executeCommand(command, 'UPDATE')
		return result.Attributes as User
	}

	// ========== PRODUCTOS ==========
	static async createProduct(product: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<Product> {
		const newProduct: Product = {
			...product,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		const command = new PutCommand({
			TableName: TABLES.PRODUCTS,
			Item: newProduct
		})

		await this.executeCommand(command, 'PUT')
		return newProduct
	}

	static async getProductById(productId: string): Promise<Product | null> {
		const command = new GetCommand({
			TableName: TABLES.PRODUCTS,
			Key: { id: productId }
		})

		const result = await this.executeCommand(command, 'GET')
		return result.Item as Product || null
	}

	static async getAllProducts(): Promise<Product[]> {
		const command = new ScanCommand({
			TableName: TABLES.PRODUCTS
		})

		const result = await this.executeCommand(command, 'SCAN')
		return result.Items as Product[] || []
	}

	static async getProductsByCategory(category: string): Promise<Product[]> {
		const command = new ScanCommand({
			TableName: TABLES.PRODUCTS,
			FilterExpression: 'category = :category',
			ExpressionAttributeValues: {
				':category': category
			}
		})

		const result = await this.executeCommand(command, 'SCAN')
		return result.Items as Product[] || []
	}

	static async updateProductStock(productId: string, newStock: number): Promise<void> {
		const command = new UpdateCommand({
			TableName: TABLES.PRODUCTS,
			Key: { id: productId },
			UpdateExpression: 'SET stock = :stock, updatedAt = :updatedAt',
			ExpressionAttributeValues: {
				':stock': newStock,
				':updatedAt': new Date()
			}
		})

		await this.executeCommand(command, 'UPDATE')
	}

	// ========== PEDIDOS ==========
	static async createOrder(order: Omit<Order, 'createdAt' | 'updatedAt'>): Promise<Order> {
		const newOrder: Order = {
			...order,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		const command = new PutCommand({
			TableName: TABLES.ORDERS,
			Item: newOrder
		})

		await this.executeCommand(command, 'PUT')
		return newOrder
	}

	static async getOrderById(orderId: string): Promise<Order | null> {
		const command = new GetCommand({
			TableName: TABLES.ORDERS,
			Key: { id: orderId }
		})

		const result = await this.executeCommand(command, 'GET')
		return result.Item as Order || null
	}

	static async getOrdersByUserId(userId: string): Promise<Order[]> {
		const command = new QueryCommand({
			TableName: TABLES.ORDERS,
			IndexName: 'UserIdIndex', // Requiere GSI
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			},
			ScanIndexForward: false // Más recientes primero
		})

		const result = await this.executeCommand(command, 'QUERY')
		return result.Items as Order[] || []
	}

	static async updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string): Promise<Order> {
		const updateParams: any = {
			TableName: TABLES.ORDERS,
			Key: { id: orderId },
			UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
			ExpressionAttributeNames: {
				'#status': 'status'
			},
			ExpressionAttributeValues: {
				':status': status,
				':updatedAt': new Date()
			},
			ReturnValues: 'ALL_NEW'
		}

		if (trackingNumber) {
			updateParams.UpdateExpression += ', trackingNumber = :trackingNumber'
			updateParams.ExpressionAttributeValues[':trackingNumber'] = trackingNumber
		}

		const command = new UpdateCommand(updateParams)
		const result = await this.executeCommand(command, 'UPDATE')
		return result.Attributes as Order
	}

	// ========== REGISTROS DE CONSUMO ==========
	static async createConsumptionRecord(record: ConsumptionRecord): Promise<ConsumptionRecord> {
		const command = new PutCommand({
			TableName: TABLES.CONSUMPTION,
			Item: record
		})

		await this.executeCommand(command, 'PUT')
		return record
	}

	static async getConsumptionRecordsByUserId(userId: string): Promise<ConsumptionRecord[]> {
		const command = new QueryCommand({
			TableName: TABLES.CONSUMPTION,
			IndexName: 'UserIdIndex', // Requiere GSI
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			}
		})

		const result = await this.executeCommand(command, 'QUERY')
		return result.Items as ConsumptionRecord[] || []
	}

	static async updateConsumptionRecord(recordId: string, updates: Partial<ConsumptionRecord>): Promise<ConsumptionRecord> {
		const updateExpression = []
		const expressionAttributeValues: any = {}

		Object.entries(updates).forEach(([key, value]) => {
			if (key !== 'id' && value !== undefined) {
				updateExpression.push(`${key} = :${key}`)
				expressionAttributeValues[`:${key}`] = value
			}
		})

		const command = new UpdateCommand({
			TableName: TABLES.CONSUMPTION,
			Key: { id: recordId },
			UpdateExpression: `SET ${updateExpression.join(', ')}`,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW'
		})

		const result = await this.executeCommand(command, 'UPDATE')
		return result.Attributes as ConsumptionRecord
	}

	// ========== RESULTADOS DE CUESTIONARIO ==========
	static async saveQuestionnaireResult(result: QuestionnaireResult & { userId: string }): Promise<void> {
		const command = new PutCommand({
			TableName: TABLES.QUESTIONNAIRE_RESULTS,
			Item: result
		})

		await this.executeCommand(command, 'PUT')
	}

	static async getQuestionnaireResultsByUserId(userId: string): Promise<QuestionnaireResult[]> {
		const command = new QueryCommand({
			TableName: TABLES.QUESTIONNAIRE_RESULTS,
			IndexName: 'UserIdIndex', // Requiere GSI
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			},
			ScanIndexForward: false // Más recientes primero
		})

		const result = await this.executeCommand(command, 'QUERY')
		return result.Items as QuestionnaireResult[] || []
	}

	// ========== OPERACIONES BATCH ==========
	static async batchCreateProducts(products: Product[]): Promise<void> {
		const putRequests = products.map(product => ({
			PutRequest: {
				Item: product
			}
		}))

		// DynamoDB permite máximo 25 items por batch
		const batches = []
		for (let i = 0; i < putRequests.length; i += 25) {
			batches.push(putRequests.slice(i, i + 25))
		}

		for (const batch of batches) {
			const command = new BatchWriteCommand({
				RequestItems: {
					[TABLES.PRODUCTS]: batch
				}
			})

			await this.executeCommand(command, 'BATCH_WRITE')
		}
	}

	// ========== UTILIDADES ==========
	static async healthCheck(): Promise<{ status: string; tables: string[] }> {
		try {
			// En desarrollo, simular respuesta exitosa
			if (process.env.NODE_ENV === 'development') {
				return {
					status: 'healthy (dev mode)',
					tables: Object.values(TABLES)
				}
			}

			// En producción, verificar acceso a las tablas
			const tableChecks = await Promise.allSettled(
				Object.values(TABLES).map(tableName => 
					docClient.send(new ScanCommand({
						TableName: tableName,
						Limit: 1
					}))
				)
			)

			const healthyTables = tableChecks.filter(result => result.status === 'fulfilled')

			return {
				status: healthyTables.length === Object.values(TABLES).length ? 'healthy' : 'partial',
				tables: Object.values(TABLES)
			}

		} catch (error) {
			console.error('DynamoDB health check failed:', error)
			return {
				status: 'unhealthy',
				tables: Object.values(TABLES)
			}
		}
	}
}

export default DynamoDBService