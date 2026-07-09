import { useState } from "react";
import { ShoppingCart, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	usePublicCarts,
	useBestCarts,
	useCartItems,
} from "../../hooks/cart/useCart";
import { useLikeCart, useUnlikeCart } from "../../hooks/cart/useCartMutation";
import { useRequireAuth } from "../../hooks/auth/useRequireAuth";
import LikeButton from "../../components/common/LikeButton";
import {
	CART_CATEGORIES,
	type CartCategory,
	type CartResponse,
} from "../../types/cart";

const PAGE_SIZE = 24; // 4열 × 6행

const FALLBACK_THUMBNAIL =
	"https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400&q=80";

// ─────────────────────────────────────────
// CartCard
// ─────────────────────────────────────────
function CartCard({ cart }: { cart: CartResponse }) {
	const navigate = useNavigate();
	const { data: items = [] } = useCartItems(cart.id);
	const { requireAuth } = useRequireAuth();
	const { mutate: like } = useLikeCart();
	const { mutate: unlike } = useUnlikeCart();
	const isShared = cart.cart_type === "SHARED";
	const categoryLabel =
		CART_CATEGORIES.find((c) => c.value === cart.category)?.label ??
		cart.category;
	const thumbnail = items[0]?.image_url ?? FALLBACK_THUMBNAIL;

	const handleClick = () => {
		navigate(`/cart/detail?id=${cart.id}&source=public`);
	};

	const handleToggleLike = requireAuth(() => {
		if (cart.is_liked) {
			unlike(cart.id);
		} else {
			like(cart.id);
		}
	});

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
				{/* 좋아요 버튼 */}
				<LikeButton
					liked={cart.is_liked}
					count={cart.like_count}
					onToggle={handleToggleLike}
					className="absolute top-2.5 right-2.5 bg-white shadow-md"
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
// CartListPage
// ─────────────────────────────────────────
export default function CartListPage() {
	const [activeCategory, setActiveCategory] = useState<CartCategory>(
		CART_CATEGORIES[0].value
	);
	const isBest = activeCategory === "BEST";
	const { data: normalCarts = [], isLoading: isNormalLoading } = usePublicCarts(
		activeCategory,
		{ enabled: !isBest }
	);
	const { data: bestCarts = [], isLoading: isBestLoading } = useBestCarts({
		enabled: isBest,
	});
	const carts = isBest ? bestCarts : normalCarts;
	const isLoading = isBest ? isBestLoading : isNormalLoading;

	const filteredCarts = carts.slice(0, PAGE_SIZE);
	const currentCategory = CART_CATEGORIES.find(
		(c) => c.value === activeCategory
	)!;

	return (
		<div className="min-h-screen bg-white">
			{/* 페이지 헤더 영역 */}
			<div className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{currentCategory.label} 장바구니
					</h1>
					<p className="mt-2 text-sm text-gray-500">
						다른 사람들이 공개한 인기 장바구니를 확인해 보세요
					</p>
				</div>
			</div>

			{/* 본문 */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
				{/* 카테고리 탭 */}
				<div className="flex overflow-x-auto border-b border-gray-200 mb-8">
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

				{/* 결과 카운트 */}
				<p className="text-sm text-gray-400 mb-6">
					<span className="font-medium text-gray-700">
						{filteredCarts.length}개
					</span>
					의 장바구니
				</p>

				{/* 그리드: lg+ 4열, md 3열, sm 2열 */}
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-4 text-gray-400">
						<p className="text-base">불러오는 중...</p>
					</div>
				) : filteredCarts.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-y-14">
						{filteredCarts.map((cart) => (
							<CartCard key={cart.id} cart={cart} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-4 text-gray-400">
						<ShoppingCart className="w-14 h-14 opacity-20" />
						<p className="text-base">
							{currentCategory.label} 카테고리의 공개 장바구니가 없습니다.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
