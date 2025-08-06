'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question, wellnessQuestionnaire, getRecommendations } from '@/lib/questionnaire'
import { mockProducts } from '@/lib/mockData'
import { ProductRecommendation } from '@/types'

export default function QuestionnaireForm() {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState<Record<string, any>>({})
	const [isCompleted, setIsCompleted] = useState(false)
	const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
	const [progress, setProgress] = useState(0)

	const questions = wellnessQuestionnaire.questions
	const currentQuestion = questions[currentQuestionIndex]

	// Filtrar preguntas que deben mostrarse basado en dependencias
	const visibleQuestions = questions.filter(question => {
		if (!question.dependsOn) return true
		
		const dependentAnswer = answers[question.dependsOn.questionId]
		if (!dependentAnswer) return false
		
		if (Array.isArray(dependentAnswer)) {
			return question.dependsOn.values.some(value => dependentAnswer.includes(value))
		}
		
		return question.dependsOn.values.includes(dependentAnswer)
	})

	useEffect(() => {
		setProgress((currentQuestionIndex / visibleQuestions.length) * 100)
	}, [currentQuestionIndex, visibleQuestions.length])

	const handleAnswer = (questionId: string, answer: any) => {
		setAnswers(prev => ({ ...prev, [questionId]: answer }))
	}

	const goToNext = () => {
		if (currentQuestionIndex < visibleQuestions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		} else {
			completeQuestionnaire()
		}
	}

	const goToPrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1)
		}
	}

	const completeQuestionnaire = () => {
		const recs = getRecommendations(answers)
		const productRecommendations = recs.map(rec => {
			const product = mockProducts.find(p => p.id === rec.productId)
			return {
				productId: rec.productId,
				product: product!,
				score: rec.priority === 'high' ? 9 : rec.priority === 'medium' ? 7 : 5,
				reasons: [rec.reason],
				priority: rec.priority as 'high' | 'medium' | 'low'
			}
		}).filter(rec => rec.product)

		setRecommendations(productRecommendations)
		setIsCompleted(true)
	}

	const isAnswerValid = () => {
		const answer = answers[currentQuestion.id]
		if (!currentQuestion.required) return true
		
		if (currentQuestion.type === 'multiple') {
			return answer && Array.isArray(answer) && answer.length > 0
		}
		
		return answer !== undefined && answer !== null && answer !== ''
	}

	const renderQuestion = (question: Question) => {
		const answer = answers[question.id]

		switch (question.type) {
			case 'single':
				return (
					<div className="space-y-3">
						{question.options?.map((option, index) => (
							<motion.button
								key={option}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleAnswer(question.id, option)}
								className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
									answer === option
										? 'border-primary-500 bg-primary-50 text-primary-800'
										: 'border-neutral-200 hover:border-neutral-300 bg-white'
								}`}
							>
								{option}
							</motion.button>
						))}
					</div>
				)

			case 'multiple':
				return (
					<div className="space-y-3">
						{question.options?.map((option, index) => {
							const isSelected = answer && Array.isArray(answer) && answer.includes(option)
							return (
								<motion.button
									key={option}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										const currentAnswers = answer || []
										const newAnswers = isSelected
											? currentAnswers.filter((a: string) => a !== option)
											: [...currentAnswers, option]
										handleAnswer(question.id, newAnswers)
									}}
									className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
										isSelected
											? 'border-primary-500 bg-primary-50 text-primary-800'
											: 'border-neutral-200 hover:border-neutral-300 bg-white'
									}`}
								>
									<div className="flex items-center">
										<div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
											isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
										}`}>
											{isSelected && (
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											)}
										</div>
										{option}
									</div>
								</motion.button>
							)
						})}
					</div>
				)

			case 'range':
				return (
					<div className="space-y-4">
						<div className="text-center">
							<span className="text-3xl font-bold text-primary-600">
								{answer || question.min}
							</span>
							{question.description && (
								<p className="text-sm text-neutral-600 mt-2">{question.description}</p>
							)}
						</div>
						<input
							type="range"
							min={question.min}
							max={question.max}
							step={question.step || 1}
							value={answer || question.min}
							onChange={(e) => handleAnswer(question.id, parseFloat(e.target.value))}
							className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
						/>
						<div className="flex justify-between text-sm text-neutral-500">
							<span>{question.min}</span>
							<span>{question.max}</span>
						</div>
					</div>
				)

			case 'number':
				return (
					<div>
						<input
							type="number"
							min={question.min}
							max={question.max}
							value={answer || ''}
							onChange={(e) => handleAnswer(question.id, parseFloat(e.target.value))}
							className="input-field text-lg text-center"
							placeholder={`${question.min} - ${question.max}`}
						/>
					</div>
				)

			case 'text':
				return (
					<div>
						<textarea
							value={answer || ''}
							onChange={(e) => handleAnswer(question.id, e.target.value)}
							className="input-field min-h-[100px] resize-none"
							placeholder="Escribe tu respuesta aquí..."
						/>
					</div>
				)

			default:
				return null
		}
	}

	if (isCompleted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-4xl mx-auto p-6"
			>
				<div className="text-center mb-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
						</svg>
					</motion.div>
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						¡Cuestionario Completado!
					</h1>
					<p className="text-lg text-neutral-600">
						Basado en tus respuestas, hemos creado recomendaciones personalizadas para ti
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-neutral-800 mb-6">
						Tus Recomendaciones Personalizadas
					</h2>
					
					{recommendations.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{recommendations.map((rec, index) => (
								<motion.div
									key={rec.productId}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className={`border-2 rounded-lg p-4 ${
										rec.priority === 'high' ? 'border-secondary-300 bg-secondary-50' :
										rec.priority === 'medium' ? 'border-primary-300 bg-primary-50' :
										'border-neutral-300 bg-neutral-50'
									}`}
								>
									<div className="flex items-start justify-between mb-3">
										<h3 className="text-lg font-semibold text-neutral-800">
											{rec.product.name}
										</h3>
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											rec.priority === 'high' ? 'bg-secondary-200 text-secondary-800' :
											rec.priority === 'medium' ? 'bg-primary-200 text-primary-800' :
											'bg-neutral-200 text-neutral-800'
										}`}>
											{rec.priority === 'high' ? 'Alta Prioridad' :
											 rec.priority === 'medium' ? 'Media Prioridad' : 'Baja Prioridad'}
										</span>
									</div>
									
									<p className="text-neutral-600 text-sm mb-3">
										{rec.product.description}
									</p>
									
									<div className="bg-white rounded p-3 mb-3">
										<p className="text-sm text-neutral-700">
											<strong>¿Por qué lo recomendamos?</strong>
										</p>
										{rec.reasons.map((reason, idx) => (
											<p key={idx} className="text-sm text-neutral-600 mt-1">
												• {reason}
											</p>
										))}
									</div>
									
									<div className="flex justify-between items-center">
										<span className="text-xl font-bold text-primary-600">
											€{rec.product.price}
										</span>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="btn-primary"
										>
											Ver Producto
										</motion.button>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-neutral-600">
								No pudimos generar recomendaciones específicas. 
								Te sugerimos explorar nuestro catálogo completo.
							</p>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="btn-primary mt-4"
							>
								Ver Todos los Productos
							</motion.button>
						</div>
					)}
				</div>

				<div className="text-center">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							setCurrentQuestionIndex(0)
							setAnswers({})
							setIsCompleted(false)
							setRecommendations([])
						}}
						className="btn-secondary mr-4"
					>
						Repetir Cuestionario
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="btn-primary"
					>
						Guardar Perfil
					</motion.button>
				</div>
			</motion.div>
		)
	}

	const visibleQuestion = visibleQuestions[currentQuestionIndex]
	if (!visibleQuestion) return null

	return (
		<div className="max-w-2xl mx-auto p-6">
			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-neutral-600">
						Pregunta {currentQuestionIndex + 1} de {visibleQuestions.length}
					</span>
					<span className="text-sm text-neutral-600">
						{Math.round(progress)}% completado
					</span>
				</div>
				<div className="w-full bg-neutral-200 rounded-full h-2">
					<motion.div
						className="bg-primary-600 h-2 rounded-full"
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.3 }}
					/>
				</div>
			</div>

			{/* Question */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentQuestionIndex}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.3 }}
					className="bg-white rounded-lg shadow-md p-8"
				>
					<div className="mb-6">
						<span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full mb-3">
							{visibleQuestion.category}
						</span>
						<h2 className="text-2xl font-semibold text-neutral-800 mb-2">
							{visibleQuestion.question}
						</h2>
						{visibleQuestion.description && (
							<p className="text-neutral-600">
								{visibleQuestion.description}
							</p>
						)}
					</div>

					<div className="mb-8">
						{renderQuestion(visibleQuestion)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={goToPrevious}
							disabled={currentQuestionIndex === 0}
							className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Anterior
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={goToNext}
							disabled={!isAnswerValid()}
							className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{currentQuestionIndex === visibleQuestions.length - 1 ? 'Finalizar' : 'Siguiente'}
						</motion.button>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}