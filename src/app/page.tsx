'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/shared/Header'

export default function Home() {
	return (
		<main className="min-h-screen">
			<Header />

			{/* Hero Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6">
							Tu <span className="text-primary-600">Asesor Digital</span> de{' '}
							<span className="text-secondary-600">Bienestar</span>
						</h1>
						<p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
							Descubre los suplementos perfectos para tus objetivos de salud con 
							recomendaciones personalizadas basadas en tu estilo de vida y necesidades específicas.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/cuestionario" className="btn-primary text-lg px-8 py-3">
								Comenzar Evaluación
							</Link>
							<Link href="/productos" className="btn-secondary text-lg px-8 py-3">
								Ver Productos
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-neutral-800 mb-4">
							¿Por qué elegir nuestra plataforma?
						</h2>
						<p className="text-xl text-neutral-600">
							Tecnología avanzada al servicio de tu bienestar
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							className="card text-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<div className="w-8 h-8 bg-primary-600 rounded-full"></div>
							</div>
							<h3 className="text-xl font-semibold text-neutral-800 mb-3">
								Recomendaciones Personalizadas
							</h3>
							<p className="text-neutral-600">
								Nuestro algoritmo analiza tus objetivos, hábitos y restricciones 
								para sugerir los suplementos más adecuados para ti.
							</p>
						</motion.div>

						<motion.div
							className="card text-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<div className="w-8 h-8 bg-secondary-600 rounded-full"></div>
							</div>
							<h3 className="text-xl font-semibold text-neutral-800 mb-3">
								Seguimiento Inteligente
							</h3>
							<p className="text-neutral-600">
								Registra tu consumo y recibe notificaciones automáticas 
								cuando sea momento de reponer tus suplementos.
							</p>
						</motion.div>

						<motion.div
							className="card text-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div className="w-16 h-16 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<div className="w-8 h-8 bg-accent-orange rounded-full"></div>
							</div>
							<h3 className="text-xl font-semibold text-neutral-800 mb-3">
								Calidad Garantizada
							</h3>
							<p className="text-neutral-600">
								Trabajamos solo con proveedores certificados y productos 
								de la más alta calidad para tu tranquilidad.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-neutral-800 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h3 className="text-2xl font-bold mb-4">WellnessSupplements</h3>
						<p className="text-neutral-300 mb-6">
							Tu salud es nuestra prioridad. Construyendo un futuro más saludable juntos.
						</p>
						<div className="flex justify-center space-x-6">
							<Link href="/privacidad" className="text-neutral-300 hover:text-white transition-colors">
								Privacidad
							</Link>
							<Link href="/terminos" className="text-neutral-300 hover:text-white transition-colors">
								Términos
							</Link>
							<Link href="/contacto" className="text-neutral-300 hover:text-white transition-colors">
								Contacto
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	)
}