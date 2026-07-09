import { useState } from "react";
import { ShoppingCart, Users, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePublicCarts, useCartItems } from "../../hooks/cart/useCart";
import {
	CART_CATEGORIES,
	type CartCategory,
	type CartResponse,
} from "../../types/cart";

const FALLBACK_THUMBNAIL =
	"https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400&q=80";

// ─────────────────────────────────────────
// CartCard 컴포넌트
// ─────────────────────────────────────────
function CartCard({ cart }: { cart: CartResponse }) {
	const navigate = useNavigate();
	const { data: items = [] } = useCartItems(cart.id);
	const isShared = cart.cart_type === "SHARED";
	const categoryLabel =
		CART_CATEGORIES.find((c) => c.value === cart.category)?.label ??
		cart.category;
	const thumbnail = items[0]?.image_url ?? FALLBACK_THUMBNAIL;

	const handleClick = () => {
		navigate(`/cart/detail?id=${cart.id}&source=public`);
	};

	return (
		<div className="group flex cursor-pointer flex-col" onClick={handleClick}>
			<div
				className="relative mb-3 w-full overflow-hidden rounded-xl"
				style={{ aspectRatio: "1 / 1" }}>
				<img
					src={thumbnail}
					alt={cart.name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-1.5">
					<ShoppingCart className="h-3.5 w-3.5 shrink-0 text-[#C8A97A]" />
					<p className="flex-1 truncate text-sm font-semibold text-gray-900">
						{cart.name}
					</p>
					<span
						className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
							isShared ? "bg-[#D4B896] text-white" : "bg-gray-100 text-gray-600"
						}`}>
						{isShared ? (
							<Users className="h-3 w-3" />
						) : (
							<User className="h-3 w-3" />
						)}
						{isShared ? "공유" : "개인"}
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-1.5 text-[11px]">
					<span className="rounded-full bg-[#F6F0E4] px-2 py-0.5 text-[#7A6E5A]">
						{categoryLabel}
					</span>
					{cart.purpose && (
						<span className="rounded-full bg-[#EEF4FF] px-2 py-0.5 text-[#456A9B]">
							{cart.purpose}
						</span>
					)}
				</div>
				{cart.budget != null && cart.budget > 0 && (
					<p className="mt-0.5 text-xs text-gray-500">
						예산 {cart.budget.toLocaleString()}원
					</p>
				)}
			</div>
		</div>
	);
}

// ─────────────────────────────────────────
// CartSection (메인 페이지 노출용)
// ─────────────────────────────────────────
export default function CartSection() {
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] = useState<CartCategory>(
		CART_CATEGORIES[0].value
	);
	const { data: carts = [], isLoading } = usePublicCarts(activeCategory);

	const filteredCarts = carts.slice(0, 8);
	const currentCategory = CART_CATEGORIES.find(
		(c) => c.value === activeCategory
	)!;

	return (
		<section className="w-full bg-white py-10 sm:py-12 lg:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* 섹션 타이틀 */}
				<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 lg:mb-5">
					장바구니 둘러보기
				</h2>

				{/* 카테고리 탭 */}
				<div className="flex overflow-x-auto border-b border-gray-200 mb-6">
					{CART_CATEGORIES.map((cat) => (
						<button
							key={cat.value}
							onClick={() => setActiveCategory(cat.value)}
							className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium rounded-t transition-all whitespace-nowrap ${
								activeCategory === cat.value
									? "bg-[#F6F0E4] text-gray-900 font-bold"
									: "text-gray-500 hover:text-gray-800"
							}`}>
							{cat.label}
						</button>
					))}
				</div>

				{/* 장바구니 그리드: lg+ 4열, md 3열, sm 2열, 모바일 2열 */}
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
						<p className="text-sm">불러오는 중...</p>
					</div>
				) : filteredCarts.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-y-16">
						{filteredCarts.map((cart) => (
							<CartCard key={cart.id} cart={cart} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
						<ShoppingCart className="w-12 h-12 opacity-30" />
						<p className="text-sm">
							{currentCategory.label} 카테고리의 인기 장바구니가 없습니다.
						</p>
					</div>
				)}

				{/* 전체보기 버튼 */}
				{filteredCarts.length > 0 && (
					<div className="flex justify-center mt-8 lg:mt-10">
						<button
							onClick={() => navigate("/cart")}
							className="px-8 sm:px-12 lg:px-16 py-3 lg:py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-1.5 text-sm sm:text-base text-gray-500 font-medium hover:bg-[#F6F0E4] hover:border-[#D4B896] transition-all">
							<span>{currentCategory.label} 장바구니 전체보기</span>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
