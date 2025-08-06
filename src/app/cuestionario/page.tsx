import Header from '@/components/shared/Header'
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm'

export default function QuestionnairePage() {
	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-neutral-800 mb-4">
							Asesor Personal de Bienestar
						</h1>
						<p className="text-xl text-neutral-600 max-w-3xl mx-auto">
							Responde unas pocas preguntas y te ayudaremos a encontrar los suplementos 
							perfectos para tus objetivos de salud y estilo de vida.
						</p>
					</div>
					<QuestionnaireForm />
				</div>
			</main>
		</>
	)
}