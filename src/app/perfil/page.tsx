import Header from '@/components/shared/Header'
import UserProfile from '@/components/user/UserProfile'

export default function ProfilePage() {
	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<UserProfile />
			</main>
		</>
	)
}