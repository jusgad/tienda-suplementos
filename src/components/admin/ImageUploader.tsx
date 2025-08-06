'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploaderProps {
	onImageUpload: (files: FileList) => void
	maxFiles?: number
	acceptedTypes?: string[]
}

export default function ImageUploader({ 
	onImageUpload, 
	maxFiles = 5, 
	acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'] 
}: ImageUploaderProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [uploadedImages, setUploadedImages] = useState<string[]>([])
	const [uploading, setUploading] = useState(false)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const processFiles = useCallback(async (files: FileList) => {
		setUploading(true)
		const validFiles = Array.from(files).filter(file => 
			acceptedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024 // 5MB limit
		)

		if (validFiles.length === 0) {
			alert('Por favor selecciona archivos de imagen válidos (JPEG, PNG, WebP) menores a 5MB')
			setUploading(false)
			return
		}

		// Simulate upload process
		const imageUrls: string[] = []
		for (const file of validFiles) {
			const url = URL.createObjectURL(file)
			imageUrls.push(url)
		}

		setTimeout(() => {
			setUploadedImages(prev => [...prev, ...imageUrls].slice(0, maxFiles))
			onImageUpload(files)
			setUploading(false)
		}, 1500)
	}, [acceptedTypes, maxFiles, onImageUpload])

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		
		const files = e.dataTransfer.files
		if (files.length > 0) {
			processFiles(files)
		}
	}, [processFiles])

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			processFiles(files)
		}
	}

	const removeImage = (index: number) => {
		setUploadedImages(prev => prev.filter((_, i) => i !== index))
	}

	return (
		<div className="space-y-6">
			<motion.div
				className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
					isDragging 
						? 'border-primary-500 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-lg' 
						: 'border-primary-200 hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-25 hover:to-secondary-25 hover:shadow-md'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				animate={{ 
					scale: isDragging ? 1.02 : 1,
					boxShadow: isDragging ? "0 10px 25px -5px rgba(34, 197, 94, 0.2)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
				}}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				<input
					type="file"
					multiple
					accept={acceptedTypes.join(',')}
					onChange={handleFileSelect}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					disabled={uploading}
					aria-label="Subir imágenes arrastrando y soltando o haciendo clic"
				/>
				
				<AnimatePresence mode="wait">
					{uploading ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-4"
						>
							<div className="text-6xl">⏳</div>
							<div>
								<p className="text-lg font-medium text-primary-600">Subiendo imágenes...</p>
								<div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
									<motion.div
										className="bg-primary-500 h-2 rounded-full"
										initial={{ width: 0 }}
										animate={{ width: '100%' }}
										transition={{ duration: 1.5 }}
									/>
								</div>
							</div>
						</motion.div>
					) : isDragging ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="space-y-6"
						>
							<motion.div 
								className="text-7xl"
								animate={{ rotate: [0, -10, 10, 0] }}
								transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
							>
								✨
							</motion.div>
							<div>
								<p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
									¡Suelta las imágenes aquí!
								</p>
								<p className="text-primary-600 font-medium mt-2">
									Subida automática en progreso
								</p>
							</div>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-6"
						>
							<motion.div 
								className="text-7xl text-primary-400"
								animate={{ y: [0, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
							>
								🖼️
							</motion.div>
							<div>
								<p className="text-xl font-bold text-neutral-700 mb-2">
									Arrastra y suelta imágenes aquí
								</p>
								<p className="text-neutral-500 mb-1">
									o haz clic para seleccionar archivos
								</p>
								<div className="inline-flex items-center space-x-2 text-xs text-neutral-400 bg-neutral-100 px-4 py-2 rounded-full">
									<span>Máximo {maxFiles} archivos</span>
									<span>•</span>
									<span>JPEG, PNG, WebP</span>
									<span>•</span>
									<span>Hasta 5MB</span>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Uploaded Images Preview */}
			<AnimatePresence>
				{uploadedImages.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-4"
					>
						<div className="flex items-center justify-between">
							<h4 className="text-lg font-semibold text-neutral-800">
								Imágenes Subidas ({uploadedImages.length})
							</h4>
							<div className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
								{uploadedImages.length} / {maxFiles}
							</div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{uploadedImages.map((url, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.8, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.8, y: -20 }}
									transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
									className="relative group"
								>
									<div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 border-2 border-primary-200 hover:border-primary-400 transition-colors duration-300">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={url}
											alt={`Uploaded ${index + 1}`}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<motion.button
											initial={{ opacity: 0, scale: 0.5 }}
											animate={{ opacity: 1, scale: 1 }}
											whileHover={{ scale: 1.15, rotate: 90 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => removeImage(index)}
											className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
											aria-label={`Eliminar imagen ${index + 1}`}
										>
											✕
										</motion.button>
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}