import { useSearchParams, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import {
	categories,
	getCategoryLabel,
	type Product,
} from "../../types/product";
import type { CartCategory } from "../../types/cart";
import { useProducts } from "../../hooks/product/useProduct";
import {
	useOpenAddToCartModal,
	useOpenSelectCartModal,
} from "../../store/useCartModalStore";
import { useAllCartsCount } from "../../store/useCartStore";

const PAGE_SIZE = 24; // 4열 × 6행

// ─────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
	const navigate = useNavigate();
	const openAddToCartModal = useOpenAddToCartModal();
	const openSelectCartModal = useOpenSelectCartModal();
	const cartCount = useAllCartsCount();

	const handleAddToCart = (e: React.MouseEvent) => {
		e.stopPropagation();
		const hasCartData = cartCount > 0;
		if (hasCartData) {
			openSelectCartModal([{ productId: product.id, quantity: 1 }]);
		} else {
			openAddToCartModal();
		}
	};

	return (
		<div
			className="group flex flex-col cursor-pointer"
			onClick={() => navigate(`/product/${product.id}`)}>
			{/* 상품 이미지 */}
			<div
				className="relative w-full rounded-xl overflow-hidden mb-3"
				style={{ aspectRatio: "1 / 1" }}>
				<img
					src={product.image_url}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				{/* 장바구니 담기 버튼 */}
				<button
					onClick={handleAddToCart}
					className="absolute bottom-2.5 right-2.5 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
					aria-label="장바구니 담기">
					<ShoppingCart className="w-4 h-4 text-gray-700" />
				</button>
			</div>

			{/* 상품 정보 */}
			<div className="flex flex-col gap-1">
				<div className="mb-1">
					<span className="rounded-full bg-[#F6F0E4] px-2 py-0.5 text-[11px] font-semibold text-[#7A6E5A]">
						{getCategoryLabel(product.category)}
					</span>
				</div>
				<p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
					{product.name}
				</p>
				<p className="text-xs text-gray-500 line-clamp-2 min-h-10">
					{product.description}
				</p>
				<p className="text-base font-bold text-gray-900 mt-0.5">
					{product.price.toLocaleString()}원
				</p>
			</div>
		</div>
	);
}

// ─────────────────────────────────────────
// CategoryProductListPage
// ─────────────────────────────────────────
export default function CategoryProductListPage() {
	const [searchParams] = useSearchParams();

	// URL ?category= 파라미터로 카테고리 결정. 없으면 전체.
	const categoryId = searchParams.get("category") ?? "all";

	const { data: products = [] } = useProducts(
		categoryId === "all" || categoryId === "best"
			? undefined
			: { category: categoryId as CartCategory }
	);
	const filteredProducts = products.slice(0, PAGE_SIZE);
	const categoryLabel =
		categoryId === "all"
			? "전체"
			: (categories.find((c) => c.id === categoryId)?.label ?? categoryId);

	return (
		<div className="min-h-screen bg-white">
			{/* 페이지 헤더 */}
			<div className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{categoryLabel}
					</h1>
					<p className="mt-2 text-sm text-gray-500">
						{categoryId === "best"
							? "가장 인기 있는 베스트 상품을 모아봤어요"
							: `${categoryLabel} 카테고리의 다양한 상품을 확인해 보세요`}
					</p>
				</div>
			</div>

			{/* 본문 */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-12 lg:pb-16">
				{/* 결과 카운트 */}
				<p className="text-sm text-gray-400 mb-6">
					<span className="font-medium text-gray-700">
						{filteredProducts.length}개
					</span>
					의 상품
				</p>

				{/* 상품 그리드: lg+ 4열, md 3열, sm 2열 */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-y-16">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-4 text-gray-400">
						<ShoppingCart className="w-14 h-14 opacity-20" />
						<p className="text-base">
							{categoryLabel} 카테고리에 등록된 상품이 없습니다.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
