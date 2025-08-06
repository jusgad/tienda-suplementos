'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ImageUploader from './ImageUploader'
import InlineEditor from './InlineEditor'

interface ContentSection {
	id: string
	title: string
	description: string
	images: string[]
	testimonials?: Testimonial[]
	products?: Product[]
}

interface Testimonial {
	id: string
	name: string
	text: string
	rating: number
}

interface Product {
	id: string
	name: string
	description: string
	color: string
}

export default function ContentManager() {
	const [homeContent, setHomeContent] = useState<ContentSection>({
		id: 'homepage',
		title: 'Siente-te bien',
		description: 'En Siente-te bien, creemos que el bienestar viene de la armonía entre cuerpo y mente. Nuestros suplementos naturales te acompañan en tu camino hacia una vida más plena y saludable.',
		images: [],
		testimonials: [
			{
				id: '1',
				name: 'María González',
				text: 'Desde que uso los suplementos de Siente-te bien, mi energía ha mejorado increíblemente. Me siento más vital cada día.',
				rating: 5
			},
			{
				id: '2',
				name: 'Carlos Rodríguez', 
				text: 'Los productos de relajación me han ayudado muchísimo con mi estrés laboral. Duermo mejor y me siento más equilibrado.',
				rating: 5
			},
			{
				id: '3',
				name: 'Ana Martín',
				text: 'La calidad es excepcional y el servicio personalizado hace toda la diferencia. Recomiendo Siente-te bien sin dudarlo.',
				rating: 5
			}
		],
		products: [
			{
				id: '1',
				name: 'Energía Natural',
				description: 'Aumenta tu vitalidad con ingredientes 100% naturales',
				color: 'from-brand-light-green to-primary-400'
			},
			{
				id: '2', 
				name: 'Relajación Premium',
				description: 'Encuentra la calma y mejora tu descanso',
				color: 'from-brand-sky-blue to-secondary-400'
			},
			{
				id: '3',
				name: 'Inmunidad Plus',
				description: 'Fortalece tus defensas de forma natural', 
				color: 'from-brand-soft-teal to-primary-500'
			}
		]
	})

	const [activeSection, setActiveSection] = useState<'general' | 'testimonials' | 'products' | 'images'>('general')

	const handleContentUpdate = (field: string, value: string) => {
		setHomeContent(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleTestimonialUpdate = (id: string, field: keyof Testimonial, value: string | number) => {
		setHomeContent(prev => ({
			...prev,
			testimonials: prev.testimonials?.map(testimonial => 
				testimonial.id === id 
					? { ...testimonial, [field]: value }
					: testimonial
			)
		}))
	}

	const handleProductUpdate = (id: string, field: keyof Product, value: string) => {
		setHomeContent(prev => ({
			...prev,
			products: prev.products?.map(product =>
				product.id === id
					? { ...product, [field]: value }
					: product
			)
		}))
	}

	const addTestimonial = () => {
		const newId = Date.now().toString()
		const newTestimonial: Testimonial = {
			id: newId,
			name: 'Nuevo Cliente',
			text: 'Escribe aquí el testimonio...',
			rating: 5
		}
		setHomeContent(prev => ({
			...prev,
			testimonials: [...(prev.testimonials || []), newTestimonial]
		}))
	}

	const deleteTestimonial = (id: string) => {
		setHomeContent(prev => ({
			...prev,
			testimonials: prev.testimonials?.filter(t => t.id !== id)
		}))
	}

	const addProduct = () => {
		const newId = Date.now().toString()
		const newProduct: Product = {
			id: newId,
			name: 'Nuevo Producto',
			description: 'Descripción del nuevo producto...',
			color: 'from-primary-400 to-secondary-400'
		}
		setHomeContent(prev => ({
			...prev,
			products: [...(prev.products || []), newProduct]
		}))
	}

	const deleteProduct = (id: string) => {
		setHomeContent(prev => ({
			...prev,
			products: prev.products?.filter(p => p.id !== id)
		}))
	}

	const handleImageUpload = (files: FileList) => {
		console.log('Images uploaded:', files)
		// Here you would typically upload to your server/cloud storage
	}

	const menuItems = [
		{ id: 'general', label: 'Contenido General', icon: '📝' },
		{ id: 'testimonials', label: 'Testimonios', icon: '💬' },
		{ id: 'products', label: 'Productos Destacados', icon: '⭐' },
		{ id: 'images', label: 'Imágenes', icon: '🖼️' },
	]

	const renderGeneralContent = () => (
		<div className="space-y-6">
			<div className="card">
				<h3 className="text-lg font-semibold mb-4">Título Principal</h3>
				<InlineEditor
					initialText={homeContent.title}
					onSave={(text) => handleContentUpdate('title', text)}
					className="text-2xl font-bold"
					placeholder="Título principal de la página..."
					maxLength={50}
				/>
			</div>

			<div className="card">
				<h3 className="text-lg font-semibold mb-4">Descripción de Marca</h3>
				<InlineEditor
					initialText={homeContent.description}
					onSave={(text) => handleContentUpdate('description', text)}
					className="text-lg leading-relaxed"
					placeholder="Descripción de tu marca y valores..."
					multiline={true}
					maxLength={300}
				/>
			</div>

			<div className="card">
				<h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
				<div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6 rounded-lg">
					<h1 className="text-2xl font-bold text-primary-600 mb-4">
						{homeContent.title}
					</h1>
					<p className="text-neutral-700 leading-relaxed">
						{homeContent.description}
					</p>
				</div>
			</div>
		</div>
	)

	const renderTestimonials = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Gestión de Testimonios</h3>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={addTestimonial}
					className="btn-primary"
				>
					Agregar Testimonio
				</motion.button>
			</div>

			<div className="grid gap-4">
				{homeContent.testimonials?.map((testimonial) => (
					<motion.div
						key={testimonial.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="card relative group"
					>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => deleteTestimonial(testimonial.id)}
							className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-opacity"
						>
							✕
						</motion.button>
						
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Nombre del Cliente
								</label>
								<InlineEditor
									initialText={testimonial.name}
									onSave={(text) => handleTestimonialUpdate(testimonial.id, 'name', text)}
									placeholder="Nombre del cliente..."
									maxLength={50}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Testimonio
								</label>
								<InlineEditor
									initialText={testimonial.text}
									onSave={(text) => handleTestimonialUpdate(testimonial.id, 'text', text)}
									placeholder="Testimonio del cliente..."
									multiline={true}
									maxLength={200}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Calificación (1-5)
								</label>
								<select
									value={testimonial.rating}
									onChange={(e) => handleTestimonialUpdate(testimonial.id, 'rating', parseInt(e.target.value))}
									className="input-field max-w-xs"
								>
									{[1, 2, 3, 4, 5].map(rating => (
										<option key={rating} value={rating}>
											{rating} {'⭐'.repeat(rating)}
										</option>
									))}
								</select>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)

	const renderProducts = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Productos Destacados</h3>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={addProduct}
					className="btn-primary"
				>
					Agregar Producto
				</motion.button>
			</div>

			<div className="grid gap-4">
				{homeContent.products?.map((product) => (
					<motion.div
						key={product.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="card relative group"
					>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => deleteProduct(product.id)}
							className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-opacity"
						>
							✕
						</motion.button>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Nombre del Producto
								</label>
								<InlineEditor
									initialText={product.name}
									onSave={(text) => handleProductUpdate(product.id, 'name', text)}
									placeholder="Nombre del producto..."
									maxLength={50}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Descripción
								</label>
								<InlineEditor
									initialText={product.description}
									onSave={(text) => handleProductUpdate(product.id, 'description', text)}
									placeholder="Descripción del producto..."
									multiline={true}
									maxLength={150}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2">
									Vista Previa
								</label>
								<div className={`w-20 h-20 bg-gradient-to-br ${product.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
									<div className="w-10 h-12 bg-white rounded-lg opacity-90"></div>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)

	const renderImages = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-4">Gestión de Imágenes</h3>
				<p className="text-neutral-600 mb-6">
					Sube imágenes para productos, banners, testimonios y otros elementos de tu tienda.
				</p>
			</div>
			
			<ImageUploader
				onImageUpload={handleImageUpload}
				maxFiles={10}
			/>
		</div>
	)

	const renderActiveSection = () => {
		switch (activeSection) {
			case 'general': return renderGeneralContent()
			case 'testimonials': return renderTestimonials()
			case 'products': return renderProducts()
			case 'images': return renderImages()
			default: return renderGeneralContent()
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-neutral-800">Gestor de Contenido</h2>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="btn-secondary"
					onClick={() => {
						alert('Cambios guardados correctamente')
						console.log('Content saved:', homeContent)
					}}
				>
					Guardar Cambios
				</motion.button>
			</div>

			{/* Section Navigation */}
			<div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
				{menuItems.map((item) => (
					<motion.button
						key={item.id}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setActiveSection(item.id as typeof activeSection)}
						className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
							activeSection === item.id
								? 'bg-white text-primary-600 shadow-sm font-medium'
								: 'text-neutral-600 hover:text-neutral-800'
						}`}
					>
						<span className="mr-2">{item.icon}</span>
						<span className="hidden sm:inline">{item.label}</span>
					</motion.button>
				))}
			</div>

			{/* Active Section Content */}
			<motion.div
				key={activeSection}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				{renderActiveSection()}
			</motion.div>
		</div>
	)
}