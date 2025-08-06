'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/shared/Header'

const SupplementJar = ({ onClick, isOpened }: { onClick: () => void; isOpened: boolean }) => {
	return (
		<div className="relative flex justify-center items-center h-64 cursor-pointer" onClick={onClick}>
			{/* Jar Container */}
			<motion.div
				className="relative"
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
			>
				{/* Jar Body */}
				<motion.div
					className="w-32 h-40 bg-gradient-to-b from-white to-neutral-100 rounded-lg border-4 border-primary-300 relative overflow-hidden shadow-2xl"
					animate={{ 
						rotateY: isOpened ? 10 : 0,
						scale: isOpened ? 1.1 : 1 
					}}
					transition={{ duration: 0.8 }}
				>
					{/* Pills inside jar */}
					{!isOpened && (
						<motion.div
							className="absolute inset-2 flex flex-wrap gap-1 justify-center items-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							{Array.from({ length: 12 }).map((_, i) => (
								<motion.div
									key={i}
									className="w-2 h-3 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"
									animate={{
										y: [0, -2, 0],
										rotate: [0, 10, -10, 0]
									}}
									transition={{
										duration: 2,
										delay: i * 0.1,
										repeat: Infinity,
										repeatType: "reverse"
									}}
								/>
							))}
						</motion.div>
					)}
					
					{/* Jar Label */}
					<div className="absolute bottom-2 left-2 right-2 text-center">
						<p className="text-xs font-bold text-primary-800">Siente-te bien</p>
					</div>
				</motion.div>

				{/* Jar Lid */}
				<motion.div
					className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-36 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg border-2 border-primary-700"
					animate={{ 
						rotateZ: isOpened ? -25 : 0,
						x: isOpened ? 40 : 0,
						y: isOpened ? -10 : 0 
					}}
					transition={{ duration: 0.8 }}
				>
					<div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-primary-700 rounded-full" />
				</motion.div>

				{/* Floating Pills Animation */}
				<AnimatePresence>
					{isOpened && (
						<>
							{Array.from({ length: 20 }).map((_, i) => (
								<motion.div
									key={`pill-${i}`}
									className="absolute w-3 h-4 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"
									style={{
										left: '50%',
										top: '50%',
									}}
									initial={{ 
										x: 0, 
										y: 0, 
										opacity: 1,
										scale: 0
									}}
									animate={{
										x: Math.cos(i * 0.314) * (100 + i * 20),
										y: Math.sin(i * 0.314) * (100 + i * 20),
										opacity: 0,
										scale: [0, 1, 0.8, 0]
									}}
									exit={{ opacity: 0 }}
									transition={{
										duration: 2,
										delay: i * 0.1,
										ease: "easeOut"
									}}
								/>
							))}
						</>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Click Hint */}
			{!isOpened && (
				<motion.div
					className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-primary-600 font-medium"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					Haz clic para abrir
				</motion.div>
			)}
		</div>
	)
}

export default function Home() {
	const [jarOpened, setJarOpened] = useState(false)
	const [showContent, setShowContent] = useState(false)

	const handleJarClick = () => {
		if (!jarOpened) {
			setJarOpened(true)
			setTimeout(() => setShowContent(true), 1500)
		}
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
			<Header />

			{/* Hero Section with Jar Animation */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6">
							<span className="text-primary-600">Siente-te bien</span>
							<br />
							<span className="text-2xl md:text-4xl text-secondary-600">Tu bienestar natural</span>
						</h1>
						
						<SupplementJar onClick={handleJarClick} isOpened={jarOpened} />

						<AnimatePresence>
							{!showContent && (
								<motion.p 
									className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto"
									initial={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									Descubre el poder de la naturaleza para tu bienestar diario
								</motion.p>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</section>

			{/* Animated Content Reveal */}
			<AnimatePresence>
				{showContent && (
					<>
						{/* Brand Description */}
						<motion.section
							className="py-16 px-4 sm:px-6 lg:px-8"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className="max-w-4xl mx-auto text-center">
								<p className="text-2xl text-neutral-700 mb-8 leading-relaxed">
									En <strong className="text-primary-600">Siente-te bien</strong>, creemos que el bienestar 
									viene de la armonía entre cuerpo y mente. Nuestros suplementos naturales te acompañan 
									en tu camino hacia una vida más plena y saludable.
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Link href="/cuestionario" className="btn-primary text-lg px-8 py-3">
										Descubre tu plan
									</Link>
									<Link href="/productos" className="btn-secondary text-lg px-8 py-3">
										Ver productos
									</Link>
								</div>
							</div>
						</motion.section>

						{/* Featured Products */}
						<motion.section
							className="py-16 bg-white/80 backdrop-blur-sm"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="text-center mb-12">
									<h2 className="text-3xl font-bold text-neutral-800 mb-4">
										Productos destacados
									</h2>
									<p className="text-xl text-neutral-600">
										Fórmulas naturales para cada necesidad
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{[
										{
											name: "Energía Natural",
											description: "Aumenta tu vitalidad con ingredientes 100% naturales",
											color: "from-brand-light-green to-primary-400"
										},
										{
											name: "Relajación Premium",
											description: "Encuentra la calma y mejora tu descanso",
											color: "from-brand-sky-blue to-secondary-400"
										},
										{
											name: "Inmunidad Plus",
											description: "Fortalece tus defensas de forma natural",
											color: "from-brand-soft-teal to-primary-500"
										}
									].map((product, index) => (
										<motion.div
											key={product.name}
											className="card text-center group hover:shadow-2xl transition-all duration-300"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
											whileHover={{ y: -5 }}
										>
											<div className={`w-20 h-20 bg-gradient-to-br ${product.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
												<div className="w-10 h-12 bg-white rounded-lg opacity-90"></div>
											</div>
											<h3 className="text-xl font-semibold text-neutral-800 mb-3">
												{product.name}
											</h3>
											<p className="text-neutral-600 mb-4">
												{product.description}
											</p>
											<button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
												Ver detalles →
											</button>
										</motion.div>
									))}
								</div>
							</div>
						</motion.section>

						{/* Testimonials */}
						<motion.section
							className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
						>
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="text-center mb-12">
									<h2 className="text-3xl font-bold text-neutral-800 mb-4">
										Historias de bienestar
									</h2>
									<p className="text-xl text-neutral-600">
										Lo que dicen nuestros clientes
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{[
										{
											name: "María González",
											text: "Desde que uso los suplementos de Siente-te bien, mi energía ha mejorado increíblemente. Me siento más vital cada día.",
											rating: 5
										},
										{
											name: "Carlos Rodríguez",
											text: "Los productos de relajación me han ayudado muchísimo con mi estrés laboral. Duermo mejor y me siento más equilibrado.",
											rating: 5
										},
										{
											name: "Ana Martín",
											text: "La calidad es excepcional y el servicio personalizado hace toda la diferencia. Recomiendo Siente-te bien sin dudarlo.",
											rating: 5
										}
									].map((testimonial, index) => (
										<motion.div
											key={testimonial.name}
											className="card"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
										>
											<div className="flex mb-4">
												{Array.from({ length: testimonial.rating }).map((_, i) => (
													<span key={i} className="text-yellow-400 text-lg">★</span>
												))}
											</div>
											<p className="text-neutral-600 mb-4 italic">
												&quot;{testimonial.text}&quot;
											</p>
											<p className="font-semibold text-neutral-800">
												— {testimonial.name}
											</p>
										</motion.div>
									))}
								</div>
							</div>
						</motion.section>

						{/* Footer */}
						<motion.footer
							className="bg-neutral-800 text-white py-12"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.6 }}
						>
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-4 text-brand-light-green">Siente-te bien</h3>
									<p className="text-neutral-300 mb-6">
										Tu bienestar natural es nuestra pasión. Juntos hacia una vida más saludable.
									</p>
									<div className="flex justify-center space-x-6">
										<Link href="/privacidad" className="text-neutral-300 hover:text-brand-light-green transition-colors">
											Privacidad
										</Link>
										<Link href="/terminos" className="text-neutral-300 hover:text-brand-light-green transition-colors">
											Términos
										</Link>
										<Link href="/contacto" className="text-neutral-300 hover:text-brand-light-green transition-colors">
											Contacto
										</Link>
									</div>
								</div>
							</div>
						</motion.footer>
					</>
				)}
			</AnimatePresence>
		</main>
	)
}