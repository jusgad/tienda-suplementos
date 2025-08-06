import { notFound } from 'next/navigation'
import Header from '@/components/shared/Header'
import ProductDetail from '@/components/products/ProductDetail'
import { mockProducts } from '@/lib/mockData'

interface ProductPageProps {
	params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { id } = await params
	const product = mockProducts.find(p => p.id === id)
	
	if (!product) {
		notFound()
	}

	return (
		<>
			<Header />
			<main className="min-h-screen">
				<ProductDetail product={product} />
			</main>
		</>
	)
}

export async function generateStaticParams() {
	return mockProducts.map((product) => ({
		id: product.id,
	}))
}