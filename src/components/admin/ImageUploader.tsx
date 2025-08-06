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
		<div className="space-y-4">
			<motion.div
				className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
					isDragging 
						? 'border-primary-500 bg-primary-50' 
						: 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				animate={{ 
					scale: isDragging ? 1.02 : 1,
					borderColor: isDragging ? '#14b8a6' : '#d1d5db'
				}}
				transition={{ duration: 0.2 }}
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
							className="space-y-4"
						>
							<div className="text-6xl">📎</div>
							<p className="text-lg font-medium text-primary-600">
								¡Suelta las imágenes aquí!
							</p>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-4"
						>
							<div className="text-6xl text-neutral-400">📁</div>
							<div>
								<p className="text-lg font-medium text-neutral-700">
									Arrastra y suelta imágenes aquí
								</p>
								<p className="text-sm text-neutral-500">
									o haz clic para seleccionar archivos
								</p>
								<p className="text-xs text-neutral-400 mt-2">
									Máximo {maxFiles} archivos • JPEG, PNG, WebP • Hasta 5MB cada uno
								</p>
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
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
					>
						{uploadedImages.map((url, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ delay: index * 0.1 }}
								className="relative group"
							>
								<div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={url}
										alt={`Uploaded ${index + 1}`}
										className="w-full h-full object-cover"
									/>
									<motion.button
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => removeImage(index)}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
										aria-label={`Eliminar imagen ${index + 1}`}
									>
										✕
									</motion.button>
								</div>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}