'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export default function Header() {
	const { user, signOut, loading } = useAuth()
	const { itemCount, toggleCart } = useCart()

	const handleSignOut = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	return (
		<header className="bg-white shadow-sm border-b border-neutral-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
							Siente-te bien
						</Link>
					</div>
					
					<nav className="hidden md:flex space-x-8" role="navigation" aria-label="Navegación principal">
						<Link 
							href="/" 
							className="text-neutral-600 hover:text-primary-600 transition-colors"
						>
							Inicio
						</Link>
						<Link 
							href="/productos" 
							className="text-neutral-600 hover:text-primary-600 transition-colors"
						>
							Productos
						</Link>
						<Link 
							href="/cuestionario" 
							className="text-neutral-600 hover:text-primary-600 transition-colors"
						>
							Asesor Personal
						</Link>
						{user && (
							<Link 
								href="/seguimiento" 
								className="text-neutral-600 hover:text-primary-600 transition-colors"
							>
								Seguimiento
							</Link>
						)}
					</nav>

					<div className="flex items-center space-x-4">
						{loading ? (
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
						) : user ? (
							<div className="flex items-center space-x-4">
								<Link 
									href="/perfil" 
									className="text-neutral-600 hover:text-primary-600 transition-colors"
								>
									Hola, {user.firstName}
								</Link>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={toggleCart}
									className="relative text-neutral-600 hover:text-primary-600 transition-colors"
									aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} ${itemCount === 1 ? 'producto' : 'productos'})` : ' vacío'}`}
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6" />
									</svg>
									{itemCount > 0 && (
										<span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{itemCount}
										</span>
									)}
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleSignOut}
									className="text-neutral-600 hover:text-red-600 transition-colors"
								>
									Salir
								</motion.button>
							</div>
						) : (
							<div className="flex items-center space-x-4">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={toggleCart}
									className="relative text-neutral-600 hover:text-primary-600 transition-colors"
									aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} ${itemCount === 1 ? 'producto' : 'productos'})` : ' vacío'}`}
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6" />
									</svg>
									{itemCount > 0 && (
										<span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{itemCount}
										</span>
									)}
								</motion.button>
								<Link 
									href="/login" 
									className="text-neutral-600 hover:text-primary-600 transition-colors"
								>
									Iniciar Sesión
								</Link>
								<Link 
									href="/register" 
									className="btn-primary"
								>
									Registrarse
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}