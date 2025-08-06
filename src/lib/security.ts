import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN = '24h'

export interface JWTPayload {
	userId: string
	email: string
	role?: string
	iat?: number
	exp?: number
}

export interface TwoFactorSetup {
	secret: string
	qrCodeUrl: string
	backupCodes: string[]
}

export class SecurityService {
	// ========== JWT MANAGEMENT ==========
	static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
		return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
	}

	static verifyToken(token: string): JWTPayload | null {
		try {
			return jwt.verify(token, JWT_SECRET) as JWTPayload
		} catch (error) {
			console.error('JWT verification failed:', error)
			return null
		}
	}

	static refreshToken(oldToken: string): string | null {
		const payload = this.verifyToken(oldToken)
		if (!payload) return null

		// Crear nuevo token sin los campos de tiempo
		const { iat, exp, ...newPayload } = payload
		return this.generateToken(newPayload)
	}

	// ========== PASSWORD HASHING ==========
	static async hashPassword(password: string): Promise<string> {
		const saltRounds = 12
		return bcrypt.hash(password, saltRounds)
	}

	static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword)
	}

	static generateSecurePassword(length: number = 16): string {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
		let password = ''
		for (let i = 0; i < length; i++) {
			password += charset.charAt(Math.floor(Math.random() * charset.length))
		}
		return password
	}

	// ========== TWO-FACTOR AUTHENTICATION ==========
	static generate2FASecret(): TwoFactorSetup {
		// Generar secret base32
		const secret = crypto.randomBytes(20).toString('base32').replace(/=/g, '')
		
		// En un entorno real, usarías una librería como 'speakeasy' para generar el QR
		const qrCodeUrl = `otpauth://totp/WellnessSupplements?secret=${secret}&issuer=WellnessSupplements`
		
		// Generar códigos de respaldo
		const backupCodes = Array.from({ length: 8 }, () => 
			crypto.randomBytes(4).toString('hex').toUpperCase()
		)

		return {
			secret,
			qrCodeUrl,
			backupCodes
		}
	}

	static verify2FAToken(secret: string, token: string): boolean {
		// En un entorno real, usarías 'speakeasy' para verificar
		// Por ahora, simulamos la verificación
		if (process.env.NODE_ENV === 'development') {
			// En desarrollo, aceptar código 123456 para pruebas
			return token === '123456'
		}

		// Implementación básica para producción (reemplazar con speakeasy)
		const timeWindow = Math.floor(Date.now() / 30000)
		const expectedToken = this.generateTOTP(secret, timeWindow)
		
		return token === expectedToken || 
			   token === this.generateTOTP(secret, timeWindow - 1) || 
			   token === this.generateTOTP(secret, timeWindow + 1)
	}

	private static generateTOTP(secret: string, timeWindow: number): string {
		// Implementación TOTP básica (en producción usar speakeasy)
		const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'))
		const timeBuffer = Buffer.alloc(8)
		timeBuffer.writeUInt32BE(timeWindow, 4)
		
		const hash = hmac.update(timeBuffer).digest()
		const offset = hash[hash.length - 1] & 0x0f
		const truncated = hash.readUInt32BE(offset) & 0x7fffffff
		
		return (truncated % 1000000).toString().padStart(6, '0')
	}

	// ========== RATE LIMITING ==========
	private static rateLimitStore = new Map<string, { count: number; resetTime: number }>()

	static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
		const now = Date.now()
		const key = identifier

		const current = this.rateLimitStore.get(key)
		
		if (!current || now > current.resetTime) {
			this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
			return true
		}

		if (current.count >= maxRequests) {
			return false
		}

		current.count++
		return true
	}

	static getRateLimitStatus(identifier: string): { remaining: number; resetTime: number } {
		const current = this.rateLimitStore.get(identifier)
		if (!current || Date.now() > current.resetTime) {
			return { remaining: 10, resetTime: Date.now() + 60000 }
		}

		return {
			remaining: Math.max(0, 10 - current.count),
			resetTime: current.resetTime
		}
	}

	// ========== INPUT SANITIZATION ==========
	static sanitizeInput(input: string): string {
		return input
			.replace(/[<>]/g, '') // Remove HTML tags
			.replace(/[&]/g, '&amp;')
			.replace(/['"]/g, '') // Remove quotes
			.trim()
	}

	static validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email) && email.length <= 254
	}

	static validatePassword(password: string): { valid: boolean; errors: string[] } {
		const errors: string[] = []

		if (password.length < 8) {
			errors.push('La contraseña debe tener al menos 8 caracteres')
		}

		if (password.length > 128) {
			errors.push('La contraseña no puede tener más de 128 caracteres')
		}

		if (!/[a-z]/.test(password)) {
			errors.push('La contraseña debe contener al menos una letra minúscula')
		}

		if (!/[A-Z]/.test(password)) {
			errors.push('La contraseña debe contener al menos una letra mayúscula')
		}

		if (!/[0-9]/.test(password)) {
			errors.push('La contraseña debe contener al menos un número')
		}

		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			errors.push('La contraseña debe contener al menos un carácter especial')
		}

		return {
			valid: errors.length === 0,
			errors
		}
	}

	// ========== SESSION MANAGEMENT ==========
	static generateSessionId(): string {
		return crypto.randomBytes(32).toString('hex')
	}

	static generateCSRFToken(): string {
		return crypto.randomBytes(24).toString('hex')
	}

	// ========== ENCRYPTION/DECRYPTION ==========
	static encrypt(text: string, key?: string): string {
		const algorithm = 'aes-256-gcm'
		const secretKey = key || JWT_SECRET
		const keyHash = crypto.createHash('sha256').update(secretKey).digest()
		
		const iv = crypto.randomBytes(16)
		const cipher = crypto.createCipher(algorithm, keyHash)
		
		let encrypted = cipher.update(text, 'utf8', 'hex')
		encrypted += cipher.final('hex')
		
		return iv.toString('hex') + ':' + encrypted
	}

	static decrypt(encryptedText: string, key?: string): string {
		const algorithm = 'aes-256-gcm'
		const secretKey = key || JWT_SECRET
		const keyHash = crypto.createHash('sha256').update(secretKey).digest()
		
		const textParts = encryptedText.split(':')
		const iv = Buffer.from(textParts.shift()!, 'hex')
		const encrypted = textParts.join(':')
		
		const decipher = crypto.createDecipher(algorithm, keyHash)
		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		
		return decrypted
	}

	// ========== AUDIT LOGGING ==========
	static logSecurityEvent(event: {
		type: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'SUSPICIOUS_ACTIVITY'
		userId?: string
		ip?: string
		userAgent?: string
		details?: any
	}): void {
		const logEntry = {
			timestamp: new Date().toISOString(),
			...event
		}

		// En producción, enviar a un servicio de logging como CloudWatch
		if (process.env.NODE_ENV === 'production') {
			// TODO: Implementar logging a CloudWatch o similar
			console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
		} else {
			console.log('🔒 Security Event:', logEntry)
		}
	}

	// ========== IP BLOCKING ==========
	private static blockedIPs = new Set<string>()
	private static suspiciousActivity = new Map<string, number>()

	static blockIP(ip: string, duration: number = 24 * 60 * 60 * 1000): void {
		this.blockedIPs.add(ip)
		setTimeout(() => {
			this.blockedIPs.delete(ip)
		}, duration)

		this.logSecurityEvent({
			type: 'SUSPICIOUS_ACTIVITY',
			ip,
			details: { action: 'IP_BLOCKED', duration }
		})
	}

	static isIPBlocked(ip: string): boolean {
		return this.blockedIPs.has(ip)
	}

	static reportSuspiciousActivity(ip: string): void {
		const current = this.suspiciousActivity.get(ip) || 0
		const newCount = current + 1
		
		this.suspiciousActivity.set(ip, newCount)

		// Bloquear IP después de 5 actividades sospechosas
		if (newCount >= 5) {
			this.blockIP(ip)
			this.suspiciousActivity.delete(ip)
		}

		// Limpiar contador después de 1 hora
		setTimeout(() => {
			this.suspiciousActivity.delete(ip)
		}, 60 * 60 * 1000)
	}
}

export default SecurityService