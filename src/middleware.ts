import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import SecurityService from '@/lib/security'

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
	'/perfil',
	'/seguimiento',
	'/checkout',
	'/admin'
]

// Rutas de API que requieren autenticación
const PROTECTED_API_ROUTES = [
	'/api/user',
	'/api/orders',
	'/api/consumption',
	'/api/admin'
]

// Rutas que requieren rol de administrador
const ADMIN_ROUTES = [
	'/admin',
	'/api/admin',
	'/api/fba'
]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

	// ========== RATE LIMITING ==========
	if (!SecurityService.checkRateLimit(ip, 100, 60000)) { // 100 requests per minute
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429 }
		)
	}

	// ========== IP BLOCKING ==========
	if (SecurityService.isIPBlocked(ip)) {
		return NextResponse.json(
			{ error: 'Access denied.' },
			{ status: 403 }
		)
	}

	// ========== SECURITY HEADERS ==========
	const response = NextResponse.next()
	
	// Content Security Policy
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; " +
		"script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com; " +
		"style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
		"font-src 'self' fonts.gstatic.com; " +
		"img-src 'self' data: https:; " +
		"connect-src 'self' api.stripe.com; " +
		"frame-src js.stripe.com; " +
		"base-uri 'self'; " +
		"form-action 'self';"
	)

	// Security headers
	response.headers.set('X-DNS-Prefetch-Control', 'on')
	response.headers.set('X-XSS-Protection', '1; mode=block')
	response.headers.set('X-Frame-Options', 'DENY')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

	// HSTS (solo en producción con HTTPS)
	if (process.env.NODE_ENV === 'production') {
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains; preload'
		)
	}

	// ========== AUTHENTICATION CHECK ==========
	const token = request.cookies.get('auth-token')?.value ||
				  request.headers.get('authorization')?.replace('Bearer ', '')

	let user = null
	if (token) {
		user = SecurityService.verifyToken(token)
	}

	// ========== ROUTE PROTECTION ==========
	
	// Proteger rutas de usuario autenticado
	const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
	const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))

	if ((isProtectedRoute || isProtectedApiRoute) && !user) {
		if (isProtectedApiRoute) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		} else {
			return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url))
		}
	}

	// Proteger rutas de administrador
	const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
	if (isAdminRoute && (!user || user.role !== 'admin')) {
		// Por ahora, cualquier usuario autenticado puede acceder al admin en desarrollo
		if (process.env.NODE_ENV === 'development' && user) {
			// Permitir acceso en desarrollo
		} else {
			if (pathname.startsWith('/api/')) {
				return NextResponse.json(
					{ error: 'Admin access required' },
					{ status: 403 }
				)
			} else {
				return NextResponse.redirect(new URL('/login', request.url))
			}
		}
	}

	// ========== API ROUTE VALIDATION ==========
	if (pathname.startsWith('/api/')) {
		// Validar Content-Type para POST/PUT requests
		if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
			const contentType = request.headers.get('content-type')
			if (!contentType?.includes('application/json')) {
				return NextResponse.json(
					{ error: 'Content-Type must be application/json' },
					{ status: 400 }
				)
			}
		}

		// CSRF Protection para requests con cookies
		if (request.method !== 'GET' && request.cookies.get('auth-token')) {
			const csrfToken = request.headers.get('x-csrf-token')
			const expectedToken = request.cookies.get('csrf-token')?.value

			if (!csrfToken || csrfToken !== expectedToken) {
				SecurityService.reportSuspiciousActivity(ip)
				return NextResponse.json(
					{ error: 'CSRF token missing or invalid' },
					{ status: 403 }
				)
			}
		}
	}

	// ========== REQUEST LOGGING ==========
	if (process.env.NODE_ENV === 'development') {
		console.log(`🌐 ${request.method} ${pathname} - IP: ${ip} - User: ${user?.email || 'anonymous'}`)
	}

	// Añadir información del usuario a los headers para las API routes
	if (user && pathname.startsWith('/api/')) {
		response.headers.set('x-user-id', user.userId)
		response.headers.set('x-user-email', user.email)
		if (user.role) {
			response.headers.set('x-user-role', user.role)
		}
	}

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
	],
}