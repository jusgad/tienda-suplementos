'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface InlineEditorProps {
	initialText: string
	onSave: (newText: string) => void
	className?: string
	placeholder?: string
	multiline?: boolean
	maxLength?: number
}

export default function InlineEditor({
	initialText,
	onSave,
	className = '',
	placeholder = 'Haz clic para editar...',
	multiline = false,
	maxLength = 500
}: InlineEditorProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(initialText)
	const [originalText, setOriginalText] = useState(initialText)
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [isEditing])

	const handleStartEdit = () => {
		setOriginalText(text)
		setIsEditing(true)
	}

	const handleSave = () => {
		if (text.trim() !== originalText) {
			onSave(text.trim())
		}
		setIsEditing(false)
	}

	const handleCancel = () => {
		setText(originalText)
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !multiline) {
			e.preventDefault()
			handleSave()
		} else if (e.key === 'Enter' && e.ctrlKey && multiline) {
			e.preventDefault()
			handleSave()
		} else if (e.key === 'Escape') {
			handleCancel()
		}
	}

	const characterCount = text.length
	const isOverLimit = characterCount > maxLength

	if (isEditing) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="space-y-3"
			>
				{multiline ? (
					<textarea
						ref={inputRef as React.RefObject<HTMLTextAreaElement>}
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleSave}
						placeholder={placeholder}
						className={`w-full p-4 border-2 rounded-xl focus:outline-none resize-none transition-all duration-300 shadow-sm ${className} ${
							isOverLimit 
								? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
								: 'border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
						}`}
						rows={4}
						maxLength={maxLength}
					/>
				) : (
					<input
						ref={inputRef as React.RefObject<HTMLInputElement>}
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleSave}
						placeholder={placeholder}
						className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm ${className} ${
							isOverLimit 
								? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
								: 'border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
						}`}
						maxLength={maxLength}
					/>
				)}
				<div className="flex justify-between items-center">
					<div className="flex space-x-3">
						<motion.button
							whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)" }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSave}
							disabled={isOverLimit}
							className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
						>
							✓ Guardar
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCancel}
							className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-300 transition-all duration-300"
						>
							✕ Cancelar
						</motion.button>
					</div>
					<span className={`text-sm font-medium px-2 py-1 rounded-full ${
						isOverLimit 
							? 'text-red-600 bg-red-50' 
							: characterCount > maxLength * 0.8 
								? 'text-orange-600 bg-orange-50' 
								: 'text-neutral-500 bg-neutral-100'
					}`}>
						{characterCount}/{maxLength}
					</span>
				</div>
				{multiline && (
					<div className="flex items-center space-x-4 text-xs text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg">
						<span>💡 <strong>Ctrl+Enter</strong> para guardar</span>
						<span>•</span>
						<span><strong>Escape</strong> para cancelar</span>
					</div>
				)}
			</motion.div>
		)
	}

	return (
		<motion.div
			whileHover={{ 
				backgroundColor: 'rgba(34, 197, 94, 0.08)',
				scale: 1.01
			}}
			onClick={handleStartEdit}
			className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 group border-2 border-transparent hover:border-primary-200 hover:shadow-md ${className}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1 min-h-[1.5rem]">
					{text || (
						<span className="text-neutral-400 italic font-medium">{placeholder}</span>
					)}
				</div>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileHover={{ opacity: 1, scale: 1 }}
					className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
				>
					<div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
						<span className="text-sm">✏️</span>
					</div>
				</motion.div>
			</div>
			<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
		</motion.div>
	)
}