import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { categories, getCategoryLabel } from "../../types/product";
import { useProducts, useBestProducts } from "../../hooks/product/useProduct";
import {
	useLikeProduct,
	useUnlikeProduct,
} from "../../hooks/product/useProductMutation";
import {
	useOpenAddToCartModal,
	useOpenSelectCartModal,
} from "../../store/useCartModalStore.ts";
import { useAllCartsCount } from "../../store/useCartStore.ts";
import { useRequireAuth } from "../../hooks/auth/useRequireAuth";
import LikeButton from "../common/LikeButton";

interface ProductSectionProps {
	title: string;
}

export default function ProductSection({ title }: ProductSectionProps) {
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] = useState(categories[0].id);
	const isBest = activeCategory === "best";

	const currentCategory = categories.find((c) => c.id === activeCategory)!;
	const { data: normalProducts = [] } = useProducts(
		isBest ? undefined : { category: activeCategory },
		{ enabled: !isBest }
	);
	const { data: bestProducts = [] } = useBestProducts({ enabled: isBest });
	const currentProducts = (isBest ? bestProducts : normalProducts).slice(0, 8);

	const openAddToCartModal = useOpenAddToCartModal();
	const openSelectCartModal = useOpenSelectCartModal();
	const cartCount = useAllCartsCount();
	const { requireAuth } = useRequireAuth();
	const { mutate: like } = useLikeProduct();
	const { mutate: unlike } = useUnlikeProduct();

	const handleAddToCart = (e: React.MouseEvent, productId: number) => {
		e.stopPropagation(); // 상세 페이지로 이동하는 부모 클릭 이벤트 방지
		const hasCartData = cartCount > 0;
		if (hasCartData) {
			openSelectCartModal([{ productId, quantity: 1 }]);
		} else {
			openAddToCartModal();
		}
	};

	const handleToggleLike = requireAuth((productId: number, liked: boolean) => {
		if (liked) {
			unlike(productId);
		} else {
			like(productId);
		}
	});

	return (
		<section className="w-full bg-white py-10 sm:py-12 lg:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* 섹션 타이틀 - props로 주입 */}
				<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 lg:mb-5">
					{title}
				</h2>

				{/* 카테고리 탭 */}
				<div className="flex overflow-x-auto border-b border-gray-200 mb-6">
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => setActiveCategory(cat.id)}
							className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium rounded-t transition-all whitespace-nowrap ${
								activeCategory === cat.id
									? "bg-[#F6F0E4] text-gray-900 font-bold"
									: "text-gray-500 hover:text-gray-800"
							}`}>
							{cat.label}
						</button>
					))}
				</div>

				{/* 상품 그리드: lg+ 4열, md 3열, sm 2열 */}
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-y-16">
					{currentProducts.map((product) => (
						<div
							key={product.id}
							onClick={() => navigate(`/product/${product.id}`)}
							className="group flex flex-col cursor-pointer">
							{/* 상품 이미지 */}
							<div
								className="relative w-full rounded-xl overflow-hidden mb-3"
								style={{ aspectRatio: "1 / 1" }}>
								<img
									src={product.image_url}
									alt={product.name}
									className="w-full h-full object-cover"
								/>
								{/* 좋아요 버튼 */}
								<LikeButton
									liked={product.is_liked}
									count={product.like_count}
									onToggle={() =>
										handleToggleLike(product.id, product.is_liked)
									}
									className="absolute top-2.5 right-2.5 bg-white shadow-md"
								/>
								{/* 장바구니 버튼 */}
								<button
									onClick={(e) => handleAddToCart(e, product.id)}
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
					))}
				</div>

				{/* 전체보기 버튼 */}
				<div className="flex justify-center mt-8 lg:mt-10">
					<button
						onClick={() => navigate(`/products?category=${activeCategory}`)}
						className="px-8 sm:px-12 lg:px-16 py-3 lg:py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-1.5 text-sm sm:text-base text-gray-500 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
						<span>{currentCategory.label} 전체보기</span>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</section>
	);
}
