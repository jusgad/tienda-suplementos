import Header from '@/components/shared/Header'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<LoginForm />
			</main>
		</>
	)
}