import { useQuery } from "@tanstack/react-query";
import {
	getProducts,
	getProduct,
	getBestProducts,
} from "../../api/product/productApi";
import type { CartCategory } from "../../types/cart";

export const PRODUCT_KEYS = {
	all: ["products"] as const,
	list: (params?: { category?: CartCategory; keyword?: string }) =>
		["products", "list", params] as const,
	best: () => ["products", "best"] as const,
	detail: (id: number) => ["products", "detail", id] as const,
};

/** 상품 목록 조회 */
export const useProducts = (
	params?: { category?: CartCategory; keyword?: string },
	options?: { enabled?: boolean }
) =>
	useQuery({
		queryKey: PRODUCT_KEYS.list(params),
		queryFn: () => getProducts(params),
		enabled: options?.enabled ?? true,
		staleTime: 5 * 60 * 1000,
	});

/** 좋아요 순 베스트 상품 목록 조회 */
export const useBestProducts = (options?: { enabled?: boolean }) =>
	useQuery({
		queryKey: PRODUCT_KEYS.best(),
		queryFn: getBestProducts,
		enabled: options?.enabled ?? true,
		staleTime: 60 * 1000,
	});

/** 단일 상품 조회 */
export const useProductDetail = (productId: number) =>
	useQuery({
		queryKey: PRODUCT_KEYS.detail(productId),
		queryFn: () => getProduct(productId),
		enabled: productId > 0,
		staleTime: 5 * 60 * 1000,
	});
