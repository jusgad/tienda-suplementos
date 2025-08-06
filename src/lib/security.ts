// Edge Runtime compatible security utilities

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

// Helper function to encode base64url
function base64urlEscape(str: string) {
  return str.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Helper function to decode base64url
function base64urlUnescape(str: string) {
  str += new Array(5 - str.length % 4).join('=')
  return str.replace(/\-/g, '+').replace(/_/g, '/')
}

export class SecurityService {
	// ========== JWT MANAGEMENT (Edge Runtime Compatible) ==========
	static async generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
		const header = {
			alg: 'HS256',
			typ: 'JWT'
		}

		const now = Math.floor(Date.now() / 1000)
		const exp = now + (24 * 60 * 60) // 24 hours

		const jwtPayload = {
			...payload,
			iat: now,
			exp: exp
		}

		const encodedHeader = base64urlEscape(btoa(JSON.stringify(header)))
		const encodedPayload = base64urlEscape(btoa(JSON.stringify(jwtPayload)))

		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(JWT_SECRET),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign']
		)

		const signature = await crypto.subtle.sign(
			'HMAC',
			key,
			new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
		)

		const signatureArray = Array.from(new Uint8Array(signature))
		const encodedSignature = base64urlEscape(btoa(String.fromCharCode(...signatureArray)))

		return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
	}

	static async verifyToken(token: string): Promise<JWTPayload | null> {
		try {
			const [headerB64, payloadB64, signatureB64] = token.split('.')
			
			const key = await crypto.subtle.importKey(
				'raw',
				new TextEncoder().encode(JWT_SECRET),
				{ name: 'HMAC', hash: 'SHA-256' },
				false,
				['verify']
			)

			const signature = new Uint8Array(
				atob(base64urlUnescape(signatureB64))
					.split('')
					.map(c => c.charCodeAt(0))
			)

			const isValid = await crypto.subtle.verify(
				'HMAC',
				key,
				signature,
				new TextEncoder().encode(`${headerB64}.${payloadB64}`)
			)

			if (!isValid) return null

			const payload = JSON.parse(atob(base64urlUnescape(payloadB64)))
			
			// Check expiration
			if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
				return null
			}

			return payload as JWTPayload
		} catch (error) {
			console.error('JWT verification failed:', error)
			return null
		}
	}

	static async refreshToken(oldToken: string): Promise<string | null> {
		const payload = await this.verifyToken(oldToken)
		if (!payload) return null

		// Crear nuevo token sin los campos de tiempo
		const { iat, exp, ...newPayload } = payload
		return this.generateToken(newPayload)
	}

	// ========== PASSWORD HASHING (Edge Runtime Compatible) ==========
	static async hashPassword(password: string): Promise<string> {
		// Generate salt
		const salt = crypto.getRandomValues(new Uint8Array(16))
		const iterations = 100000

		// Hash password with PBKDF2
		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(password),
			'PBKDF2',
			false,
			['deriveBits']
		)

		const hashBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: iterations,
				hash: 'SHA-256'
			},
			key,
			256
		)

		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const saltArray = Array.from(salt)
		const saltB64 = btoa(String.fromCharCode(...saltArray))
		const hashB64 = btoa(String.fromCharCode(...hashArray))

		return `${iterations}:${saltB64}:${hashB64}`
	}

	static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
		try {
			const [iterationsStr, saltB64, hashB64] = hashedPassword.split(':')
			const iterations = parseInt(iterationsStr, 10)

			const salt = new Uint8Array(
				atob(saltB64).split('').map(c => c.charCodeAt(0))
			)

			const key = await crypto.subtle.importKey(
				'raw',
				new TextEncoder().encode(password),
				'PBKDF2',
				false,
				['deriveBits']
			)

			const hashBuffer = await crypto.subtle.deriveBits(
				{
					name: 'PBKDF2',
					salt: salt,
					iterations: iterations,
					hash: 'SHA-256'
				},
				key,
				256
			)

			const hashArray = Array.from(new Uint8Array(hashBuffer))
			const computedHash = btoa(String.fromCharCode(...hashArray))
			return computedHash === hashB64
		} catch (error) {
			console.error('Password verification failed:', error)
			return false
		}
	}

	static generateSecurePassword(length: number = 16): string {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
		let password = ''
		const randomBytes = crypto.getRandomValues(new Uint8Array(length))
		
		for (let i = 0; i < length; i++) {
			password += charset.charAt(randomBytes[i] % charset.length)
		}
		return password
	}

	// ========== TWO-FACTOR AUTHENTICATION (Edge Runtime Compatible) ==========
	static generate2FASecret(): TwoFactorSetup {
		// Generar secret base32
		const randomBytes = crypto.getRandomValues(new Uint8Array(20))
		const secret = this.bytesToBase32(randomBytes).replace(/=/g, '')
		
		// En un entorno real, usarías una librería como 'speakeasy' para generar el QR
		const qrCodeUrl = `otpauth://totp/WellnessSupplements?secret=${secret}&issuer=WellnessSupplements`
		
		// Generar códigos de respaldo
		const backupCodes = Array.from({ length: 8 }, () => {
			const bytes = crypto.getRandomValues(new Uint8Array(4))
			return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
		})

		return {
			secret,
			qrCodeUrl,
			backupCodes
		}
	}

	private static bytesToBase32(bytes: Uint8Array): string {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let result = ''
		let bits = 0
		let value = 0

		for (let i = 0; i < bytes.length; i++) {
			value = (value << 8) | bytes[i]
			bits += 8

			while (bits >= 5) {
				result += alphabet[(value >>> (bits - 5)) & 31]
				bits -= 5
			}
		}

		if (bits > 0) {
			result += alphabet[(value << (5 - bits)) & 31]
		}

		return result
	}

	static async verify2FAToken(secret: string, token: string): Promise<boolean> {
		// En un entorno real, usarías 'speakeasy' para verificar
		// Por ahora, simulamos la verificación
		if (process.env.NODE_ENV === 'development') {
			// En desarrollo, aceptar código 123456 para pruebas
			return token === '123456'
		}

		// Implementación básica para producción (reemplazar con speakeasy)
		const timeWindow = Math.floor(Date.now() / 30000)
		const expectedToken = await this.generateTOTP(secret, timeWindow)
		const prevToken = await this.generateTOTP(secret, timeWindow - 1)
		const nextToken = await this.generateTOTP(secret, timeWindow + 1)
		
		return token === expectedToken || token === prevToken || token === nextToken
	}

	private static async generateTOTP(secret: string, timeWindow: number): Promise<string> {
		// Implementación TOTP básica compatible con Edge Runtime
		const secretBytes = this.base32ToBytes(secret)
		const timeBuffer = new ArrayBuffer(8)
		const timeView = new DataView(timeBuffer)
		timeView.setUint32(4, timeWindow, false) // big endian
		
		const keyBuffer = new ArrayBuffer(secretBytes.length)
		const keyView = new Uint8Array(keyBuffer)
		keyView.set(secretBytes)
		
		const key = await crypto.subtle.importKey(
			'raw',
			keyBuffer,
			{ name: 'HMAC', hash: 'SHA-1' },
			false,
			['sign']
		)
		
		const signature = await crypto.subtle.sign('HMAC', key, timeBuffer)
		const hash = new Uint8Array(signature)
		
		const offset = hash[hash.length - 1] & 0x0f
		const truncated = ((hash[offset] & 0x7f) << 24) |
			((hash[offset + 1] & 0xff) << 16) |
			((hash[offset + 2] & 0xff) << 8) |
			(hash[offset + 3] & 0xff)
		
		return (truncated % 1000000).toString().padStart(6, '0')
	}

	private static base32ToBytes(base32: string): Uint8Array {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let bits = 0
		let value = 0
		const result = []

		for (let i = 0; i < base32.length; i++) {
			const index = alphabet.indexOf(base32[i].toUpperCase())
			if (index === -1) continue

			value = (value << 5) | index
			bits += 5

			if (bits >= 8) {
				result.push((value >>> (bits - 8)) & 255)
				bits -= 8
			}
		}

		return new Uint8Array(result)
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

	// ========== SESSION MANAGEMENT (Edge Runtime Compatible) ==========
	static generateSessionId(): string {
		const randomBytes = crypto.getRandomValues(new Uint8Array(32))
		return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')
	}

	static generateCSRFToken(): string {
		const randomBytes = crypto.getRandomValues(new Uint8Array(24))
		return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')
	}

	// ========== ENCRYPTION/DECRYPTION (Edge Runtime Compatible) ==========
	static async encrypt(text: string, keyStr?: string): Promise<string> {
		const secretKey = keyStr || JWT_SECRET
		
		// Generate key from secret
		const keyMaterial = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(secretKey),
			'PBKDF2',
			false,
			['deriveBits']
		)
		
		const salt = crypto.getRandomValues(new Uint8Array(16))
		const keyBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: 100000,
				hash: 'SHA-256'
			},
			keyMaterial,
			256
		)
		
		const key = await crypto.subtle.importKey(
			'raw',
			keyBuffer,
			'AES-GCM',
			false,
			['encrypt']
		)
		
		const iv = crypto.getRandomValues(new Uint8Array(12))
		const encrypted = await crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			key,
			new TextEncoder().encode(text)
		)
		
		const saltArray = Array.from(salt)
		const ivArray = Array.from(iv)
		const saltB64 = btoa(String.fromCharCode(...saltArray))
		const ivB64 = btoa(String.fromCharCode(...ivArray))
		const encryptedArray = Array.from(new Uint8Array(encrypted))
		const encryptedB64 = btoa(String.fromCharCode(...encryptedArray))
		
		return `${saltB64}:${ivB64}:${encryptedB64}`
	}

	static async decrypt(encryptedText: string, keyStr?: string): Promise<string> {
		try {
			const [saltB64, ivB64, encryptedB64] = encryptedText.split(':')
			const secretKey = keyStr || JWT_SECRET
			
			const salt = new Uint8Array(atob(saltB64).split('').map(c => c.charCodeAt(0)))
			const iv = new Uint8Array(atob(ivB64).split('').map(c => c.charCodeAt(0)))
			const encrypted = new Uint8Array(atob(encryptedB64).split('').map(c => c.charCodeAt(0)))
			
			// Derive key
			const keyMaterial = await crypto.subtle.importKey(
				'raw',
				new TextEncoder().encode(secretKey),
				'PBKDF2',
				false,
				['deriveBits']
			)
			
			const keyBuffer = await crypto.subtle.deriveBits(
				{
					name: 'PBKDF2',
					salt: salt,
					iterations: 100000,
					hash: 'SHA-256'
				},
				keyMaterial,
				256
			)
			
			const key = await crypto.subtle.importKey(
				'raw',
				keyBuffer,
				'AES-GCM',
				false,
				['decrypt']
			)
			
			const decrypted = await crypto.subtle.decrypt(
				{
					name: 'AES-GCM',
					iv: iv
				},
				key,
				encrypted
			)
			
			return new TextDecoder().decode(decrypted)
		} catch (error) {
			console.error('Decryption failed:', error)
			throw new Error('Decryption failed')
		}
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