import MainCarousel from "../../components/layout/MainCarousel.tsx";
import CartSection from "../../components/cart/CartSection.tsx";
import ProductSection from "../../components/products/ProductSection.tsx";

export default function MainPage() {
	return (
		<main className="flex-1 bg-white">
			<MainCarousel />
			<CartSection />
			<ProductSection title="상품 둘러보기" />
		</main>
	);
}
