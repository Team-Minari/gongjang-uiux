import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { getCategoryLabel } from "../../types/product";
import {
	useCartDetail,
	useCartItems,
	useCartParticipants,
} from "../../hooks/cart/useCart";
import { useAuthStore } from "../../store/auth/useAuthStore";
import SharedCartPanel from "../../components/cart/SharedCartPanel";
import { useOpenSelectCartModal } from "../../store/useCartModalStore";
import {
	useDeleteCartItem,
	useLikeCart,
	useUnlikeCart,
} from "../../hooks/cart/useCartMutation";
import { useRequireAuth } from "../../hooks/auth/useRequireAuth";
import LikeButton from "../../components/common/LikeButton";
import type { CartItemResponse } from "../../types/cart";

// ── 통합 아이템 타입 ──
type UnifiedItem = {
	id: number;
	productId: number;
	productName: string;
	price: number;
	imageUrl: string;
	quantity: number;
	categoryLabel: string;
};

const fromApiItem = (item: CartItemResponse): UnifiedItem => ({
	id: item.id,
	productId: item.product_id,
	productName: item.product_name,
	price: item.price,
	imageUrl: item.image_url,
	quantity: item.quantity,
	categoryLabel: getCategoryLabel("best"),
});

export default function CartDetailPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const openSelectCartModal = useOpenSelectCartModal();
	const deleteItemMutation = useDeleteCartItem();
	const { mutate: likeCartMutate } = useLikeCart();
	const { mutate: unlikeCartMutate } = useUnlikeCart();
	const { requireAuth } = useRequireAuth();
	const currentUserId = useAuthStore((s) => s.user?.id);

	const cartId = Number(searchParams.get("id"));
	const source = searchParams.get("source");
	const isPublic = source === "public";

	// ── API 호출 (공개/내 장바구니 모두) ──
	const { data: cart, isLoading: cartLoading } = useCartDetail(cartId);
	const { data: items = [], isLoading: itemsLoading } = useCartItems(cartId);
	// 참여자 목록은 참여자만 조회 가능 → 공개 진입에서는 비활성
	const { data: participants = [] } = useCartParticipants(cartId, !isPublic);

	// ── 표시 데이터 ──
	const cartName = cart?.name;
	const cartPurpose = cart?.purpose;
	const cartBudget = cart?.budget;
	const isSharedCart = cart?.cart_type === "SHARED";
	const isOwner = !isPublic && cart?.owner_id === currentUserId;
	const linkToken = !isPublic ? cart?.link_token : undefined;

	const allItems = useMemo<UnifiedItem[]>(
		() => items.map(fromApiItem),
		[items]
	);

	const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
	const [initializedCartId, setInitializedCartId] = useState<number | null>(
		null
	);

	useEffect(() => {
		if (allItems.length > 0 && initializedCartId !== cartId) {
			setCheckedIds(new Set(allItems.map((item) => item.id)));
			setInitializedCartId(cartId);
		}
	}, [allItems, cartId, initializedCartId]);

	const isAllChecked =
		allItems.length > 0 && checkedIds.size === allItems.length;
	const isIndeterminate =
		checkedIds.size > 0 && checkedIds.size < allItems.length;

	const handleToggleAll = () => {
		setCheckedIds(
			isAllChecked ? new Set() : new Set(allItems.map((item) => item.id))
		);
	};

	const handleToggleItem = (id: number) => {
		setCheckedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const handleDelete = (itemId: number) => {
		deleteItemMutation.mutate({ cartId, itemId });
	};

	const handleDeleteChecked = () => {
		checkedIds.forEach((itemId) => {
			deleteItemMutation.mutate({ cartId, itemId });
		});
	};

	const handleOpenProduct = (item: UnifiedItem) => {
		navigate(`/product/${item.productId}`);
	};

	const checkedItems = allItems.filter((item) => checkedIds.has(item.id));
	const totalPrice = checkedItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const handleToggleLike = requireAuth(() => {
		if (!cart) return;
		if (cart.is_liked) {
			unlikeCartMutate(cart.id);
		} else {
			likeCartMutate(cart.id);
		}
	});

	const showSharedPanel = !isPublic && isSharedCart;
	const budgetUsage = cartBudget
		? Math.min((totalPrice / cartBudget) * 100, 100)
		: 0;

	const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

	// ── 로딩 / 에러 ──
	if (cartLoading || itemsLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center bg-white">
				<p className="text-gray-400">장바구니를 불러오는 중...</p>
			</div>
		);
	}

	if (!cart) {
		return (
			<div className="flex min-h-[400px] items-center justify-center bg-white">
				<p className="text-gray-400">장바구니를 찾을 수 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="bg-white">
			{/* 헤더 */}
			<div className="bg-white">
				<div className="mx-auto flex max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 sm:px-6 pb-5 pt-6 sm:pt-8">
					<div className="flex flex-wrap items-center gap-3 lg:pl-6">
						<h1 className="text-xl font-semibold text-gray-900">
							{cartName ?? "장바구니"}
						</h1>
						{cart.is_public && (
							<LikeButton
								liked={cart.is_liked}
								count={cart.like_count}
								onToggle={handleToggleLike}
							/>
						)}
						{isSharedCart && (
							<span className="rounded-full border border-[#D9CEBC] bg-[#F7F3E9] px-2 py-0.5 text-sm font-medium text-[#7A6E5A]">
								공유
							</span>
						)}
						{cartPurpose && (
							<span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-sm font-medium text-[#456A9B]">
								{cartPurpose}
							</span>
						)}
						{cartBudget && (
							<div className="ml-2 flex w-fit min-w-[320px] items-end gap-4 px-2 py-1">
								<div className="flex flex-1 flex-col gap-2">
									<p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
										예산
									</p>
									<div className="h-2.5 overflow-hidden rounded-full bg-[#E9E1D3]">
										<div
											className="h-full rounded-full bg-[#C8A97A]"
											style={{ width: `${budgetUsage}%` }}
										/>
									</div>
									<div className="flex items-center justify-between gap-3 text-[11px]">
										<span className="text-gray-500">선택 금액</span>
										<span className="font-medium text-gray-700">
											{formatPrice(totalPrice)}
											<span className="mx-1 text-gray-400">/</span>
											{formatPrice(cartBudget)}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 본문 */}
			<div className="mx-auto max-w-7xl w-full min-w-0 px-4 sm:px-6 pb-4 pt-5">
				<div
					className={`w-full min-w-0 ${
						showSharedPanel
							? "grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_320px]"
							: ""
					}`}>
					<div className="min-w-0 flex flex-col gap-10">
						{allItems.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-white py-24">
								<div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F7F3E9]">
									<ShoppingBag className="h-12 w-12 text-[#C8BFA8]" />
								</div>
								<div className="space-y-1.5 text-center">
									<p className="text-xl font-semibold text-gray-800">
										장바구니가 비어있습니다
									</p>
									<p className="text-sm text-gray-500">
										원하는 상품을 담아보세요!
									</p>
								</div>
								<button
									onClick={() => navigate("/")}
									className="mt-2 rounded-xl bg-[#F7F3E9] px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-[#F3EEE0]">
									쇼핑 계속하기
								</button>
							</div>
						) : (
							<>
								<div className="mb-1 flex items-center justify-between px-2 sm:px-6 py-3">
									<label className="flex cursor-pointer select-none items-center gap-2.5">
										<input
											type="checkbox"
											checked={isAllChecked}
											ref={(el) => {
												if (el) el.indeterminate = isIndeterminate;
											}}
											onChange={handleToggleAll}
											className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-gray-800"
										/>
										<span className="text-sm font-medium text-gray-700">
											{isPublic ? "담을 상품 선택" : "전체 선택"}
											<span className="ml-1 text-gray-400">
												({checkedIds.size}/{allItems.length})
											</span>
										</span>
									</label>

									{!isPublic && checkedIds.size > 0 && (
										<button
											onClick={handleDeleteChecked}
											className="text-sm text-red-400 transition-colors hover:text-red-600">
											선택 삭제
										</button>
									)}
								</div>

								<div className="overflow-hidden rounded-2xl bg-white divide-y divide-[#F0EBE0]">
									{allItems.map((item) => {
										const isChecked = checkedIds.has(item.id);

										return (
											<div
												key={item.id}
												className={`flex items-center gap-3 sm:gap-5 px-3 sm:px-6 py-4 sm:py-5 transition-colors ${
													isChecked ? "bg-white" : "bg-gray-50/60"
												}`}>
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() => handleToggleItem(item.id)}
													className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-gray-800"
												/>

												<button
													type="button"
													onClick={() => handleOpenProduct(item)}
													className={`h-16 w-16 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F7F3E9] text-left transition hover:scale-[1.02] ${
														!isChecked ? "opacity-40" : ""
													}`}>
													<img
														src={item.imageUrl}
														alt={item.productName}
														className="h-full w-full object-cover"
													/>
												</button>

												<div
													className={`min-w-0 flex-1 transition-opacity ${
														!isChecked ? "opacity-40" : ""
													}`}>
													<div className="mb-2 flex items-center gap-2 text-[11px]">
														<span className="rounded-full bg-[#F6F0E4] px-2 py-0.5 text-[#7A6E5A]">
															{item.categoryLabel}
														</span>
													</div>

													<button
														type="button"
														onClick={() => handleOpenProduct(item)}
														className="block max-w-full text-left">
														<p className="truncate text-base font-semibold text-gray-900 hover:text-[#7A6E5A]">
															{item.productName}
														</p>
													</button>
													<div className="mt-3 flex items-center gap-2">
														<p className="text-sm font-semibold text-gray-800">
															{formatPrice(item.price)}
														</p>
														{item.quantity > 1 && (
															<span className="text-xs text-gray-400">
																× {item.quantity}
															</span>
														)}
													</div>
												</div>

												<div className="hidden sm:block w-24 text-right">
													<p className="text-sm font-bold text-gray-900">
														{formatPrice(item.price * item.quantity)}
													</p>
												</div>

												{!isPublic && isOwner && (
													<button
														onClick={() => handleDelete(item.id)}
														className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
														<Trash2 className="h-4 w-4" />
													</button>
												)}
											</div>
										);
									})}
								</div>

								{/* 주문 요약 */}
								<div className="px-2">
									<div className="border-t border-[#EDE9E0] pt-8">
										<h2 className="text-base font-semibold text-gray-900">
											{isPublic ? "담기 요약" : "주문 요약"}
										</h2>

										<div className="mt-4 flex flex-col gap-2">
											{checkedItems.length === 0 ? (
												<p className="py-2 text-center text-sm text-gray-400">
													{isPublic
														? "담을 상품을 선택해 주세요"
														: "선택된 상품이 없습니다"}
												</p>
											) : (
												checkedItems.map((item) => (
													<div
														key={item.id}
														className="flex justify-between gap-3 text-sm text-gray-600">
														<div className="min-w-0">
															<p className="truncate">
																{item.productName}
																{item.quantity > 1 && ` × ${item.quantity}`}
															</p>
														</div>
														<span className="shrink-0 font-medium text-gray-800">
															{formatPrice(item.price * item.quantity)}
														</span>
													</div>
												))
											)}
										</div>

										<div className="mt-6 flex flex-col gap-2.5 border-t border-[#EDE9E0] pt-6">
											<div className="flex justify-between text-sm text-gray-500">
												<span>선택 상품</span>
												<span>{checkedItems.length}개</span>
											</div>
											<div className="mt-1 flex items-baseline justify-between">
												<span className="text-sm font-medium text-gray-700">
													합계
												</span>
												<span className="text-xl font-bold text-gray-900">
													{formatPrice(totalPrice)}
												</span>
											</div>
										</div>

										<div className="mt-6">
											{isPublic ? (
												<div className="flex flex-col gap-2">
													<button
														disabled={checkedItems.length === 0}
														onClick={requireAuth(() =>
															openSelectCartModal(
																checkedItems.map((item) => ({
																	productId: item.productId,
																	quantity: item.quantity,
																}))
															)
														)}
														className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7F3E9] py-3.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-[#F3EEE0] disabled:cursor-not-allowed disabled:opacity-40">
														<ShoppingCart className="h-4 w-4" />
														선택 상품 담기 ({checkedItems.length})
													</button>
													<button
														onClick={requireAuth(() =>
															openSelectCartModal(
																allItems.map((item) => ({
																	productId: item.productId,
																	quantity: item.quantity,
																}))
															)
														)}
														className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9CEBC] py-3.5 text-sm font-semibold tracking-wide text-gray-700 transition-colors hover:bg-[#FDFBF6]">
														<ShoppingCart className="h-4 w-4" />
														모두 담기 ({allItems.length})
													</button>
												</div>
											) : (
												<button
													disabled={checkedItems.length === 0}
													className="w-full rounded-xl bg-[#F7F3E9] py-3.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-[#F3EEE0] disabled:cursor-not-allowed disabled:opacity-40">
													주문하기 ({checkedItems.length})
												</button>
											)}
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					{showSharedPanel && linkToken && (
						<div className="sticky top-6 flex flex-col gap-4">
							<SharedCartPanel
								cartId={cartId}
								shareLink={`${window.location.origin}/cart/join?token=${linkToken}`}
								participants={participants}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
