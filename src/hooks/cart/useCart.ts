import { useQuery } from "@tanstack/react-query";
import {
	getMyCarts,
	getCartDetail,
	getCartItems,
	getCartParticipants,
	getPublicCarts,
	getBestCarts,
	searchCarts,
} from "../../api/cart/cartApi";
import { useAuthStore } from "../../store/auth/useAuthStore";
import type { CartCategory, CartResponse } from "../../types/cart";

export const CART_KEYS = {
	all: ["carts"] as const,
	myList: () => ["carts", "my"] as const,
	detail: (cartId: number) => ["carts", "detail", cartId] as const,
	items: (cartId: number) => ["carts", "items", cartId] as const,
	participants: (cartId: number) => ["carts", "participants", cartId] as const,
	publicList: (category?: CartCategory) =>
		["carts", "public", category ?? "all"] as const,
	best: () => ["carts", "best"] as const,
	search: (query: string) => ["carts", "search", query] as const,
};

/** 공개 장바구니 목록 (비인증 가능, category 필터 옵션) */
export const usePublicCarts = (
	category?: CartCategory,
	options?: { enabled?: boolean }
) =>
	useQuery({
		queryKey: CART_KEYS.publicList(category),
		queryFn: () => getPublicCarts(category),
		enabled: options?.enabled ?? true,
		staleTime: 60 * 1000,
	});

/** 좋아요 순 베스트 장바구니 목록 (공개 장바구니만 대상) */
export const useBestCarts = (options?: { enabled?: boolean }) =>
	useQuery({
		queryKey: CART_KEYS.best(),
		queryFn: getBestCarts,
		enabled: options?.enabled ?? true,
		staleTime: 60 * 1000,
	});

/** 자연어 장바구니 검색 (query가 비어있으면 비활성) */
export const useSearchCarts = (query: string) =>
	useQuery({
		queryKey: CART_KEYS.search(query),
		queryFn: () => searchCarts(query),
		enabled: query.trim().length > 0,
		staleTime: 60 * 1000,
	});

/** 내 장바구니 전체 목록 */
export const useMyCarts = () => {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery({
		queryKey: CART_KEYS.myList(),
		queryFn: getMyCarts,
		enabled: isAuthenticated,
		staleTime: 30 * 1000,
	});
};

/** 내 개인 장바구니 */
export const usePersonalCarts = (): CartResponse[] => {
	const { data: carts = [] } = useMyCarts();
	return carts.filter((c) => c.cart_type === "PERSONAL");
};

/** 내 공유 장바구니 */
export const useSharedCarts = (): CartResponse[] => {
	const { data: carts = [] } = useMyCarts();
	return carts.filter((c) => c.cart_type === "SHARED");
};

/** 내 장바구니 총 개수 */
export const useMyCartsCount = (): number => {
	const { data: carts = [] } = useMyCarts();
	return carts.length;
};

/** 장바구니 상세 (source=public이 아닌 내 장바구니만) */
export const useCartDetail = (cartId: number, enabled = true) =>
	useQuery({
		queryKey: CART_KEYS.detail(cartId),
		queryFn: () => getCartDetail(cartId),
		enabled: cartId > 0 && enabled,
		staleTime: 30 * 1000,
	});

/** 장바구니 아이템 목록 */
export const useCartItems = (cartId: number, enabled = true) =>
	useQuery({
		queryKey: CART_KEYS.items(cartId),
		queryFn: () => getCartItems(cartId),
		enabled: cartId > 0 && enabled,
		staleTime: 30 * 1000,
	});

/** 장바구니 참여자 목록 */
export const useCartParticipants = (cartId: number, enabled = true) =>
	useQuery({
		queryKey: CART_KEYS.participants(cartId),
		queryFn: () => getCartParticipants(cartId),
		enabled: cartId > 0 && enabled,
		staleTime: 30 * 1000,
	});
