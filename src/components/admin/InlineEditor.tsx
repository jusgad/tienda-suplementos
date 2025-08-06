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
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="space-y-2"
			>
				{multiline ? (
					<textarea
						ref={inputRef as React.RefObject<HTMLTextAreaElement>}
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleSave}
						placeholder={placeholder}
						className={`w-full p-2 border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none ${className} ${
							isOverLimit ? 'border-red-300' : ''
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
						className={`w-full p-2 border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:outline-none ${className} ${
							isOverLimit ? 'border-red-300' : ''
						}`}
						maxLength={maxLength}
					/>
				)}
				<div className="flex justify-between items-center">
					<div className="flex space-x-2">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSave}
							disabled={isOverLimit}
							className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Guardar
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCancel}
							className="px-3 py-1 bg-neutral-300 text-neutral-700 rounded text-sm hover:bg-neutral-400"
						>
							Cancelar
						</motion.button>
					</div>
					<span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-neutral-500'}`}>
						{characterCount}/{maxLength}
					</span>
				</div>
				{multiline && (
					<p className="text-xs text-neutral-500">
						Presiona Ctrl+Enter para guardar, Escape para cancelar
					</p>
				)}
			</motion.div>
		)
	}

	return (
		<motion.div
			whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
			onClick={handleStartEdit}
			className={`relative cursor-pointer rounded-lg p-2 transition-colors duration-200 group ${className}`}
		>
			{text || (
				<span className="text-neutral-400 italic">{placeholder}</span>
			)}
			<motion.div
				initial={{ opacity: 0 }}
				whileHover={{ opacity: 1 }}
				className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<div className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
					<span className="text-xs">✏️</span>
				</div>
			</motion.div>
		</motion.div>
	)
}