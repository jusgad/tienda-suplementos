import Header from '@/components/shared/Header'
import ConsumptionTracker from '@/components/consumption/ConsumptionTracker'

export default function ConsumptionPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<ConsumptionTracker />
			</main>
		</>
	)
}