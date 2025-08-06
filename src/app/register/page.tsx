import Header from '@/components/shared/Header'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<RegisterForm />
			</main>
		</>
	)
}