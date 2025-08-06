import Header from '@/components/shared/Header'
import ProductCatalog from '@/components/products/ProductCatalog'

export default function ProductsPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen">
				<ProductCatalog />
			</main>
		</>
	)
}