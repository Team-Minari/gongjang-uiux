import { apiClient } from "../client";
import type { ApiResponse } from "../../types/auth/auth";
import type { Product } from "../../types/product";
import type { CartCategory } from "../../types/cart";

const BASE = "/api/products";

/** 상품 목록 조회 (카테고리 / 키워드 필터) */
export const getProducts = (params?: {
	category?: CartCategory;
	keyword?: string;
}) =>
	apiClient
		.get<ApiResponse<Product[]>>(BASE, { params })
		.then((res) => res.data.data);

/** 단일 상품 조회 */
export const getProduct = (productId: number) =>
	apiClient
		.get<ApiResponse<Product>>(`${BASE}/${productId}`)
		.then((res) => res.data.data);

/** 좋아요 순 베스트 상품 목록 조회 */
export const getBestProducts = () =>
	apiClient
		.get<ApiResponse<Product[]>>(`${BASE}/best`)
		.then((res) => res.data.data);

/** 상품 좋아요 */
export const likeProduct = (productId: number) =>
	apiClient.post(`${BASE}/${productId}/like`);

/** 상품 좋아요 취소 */
export const unlikeProduct = (productId: number) =>
	apiClient.delete(`${BASE}/${productId}/like`);
