import type { CartCategory } from "./cart";

// ── 백엔드 ProductResponse 매핑 ──
export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image_url: string;
	category: CartCategory;
	like_count: number;
	is_liked: boolean;
}

// ── 카테고리 탭 (best는 백엔드 enum에 없는 UI 전용 ID) ──
export type ProductCategoryId = CartCategory | "best";

export interface Category {
	id: ProductCategoryId;
	label: string;
}

export const categories: Category[] = [
	{ id: "best", label: "베스트" },
	{ id: "LIVING", label: "생활용품" },
	{ id: "INGREDIENTS", label: "식재료" },
	{ id: "OFFICE", label: "사무용품" },
	{ id: "CAMPING", label: "캠핑용품" },
];

// mock 데이터의 소문자 카테고리와 백엔드 enum 둘 다 라벨로 매핑
const labelMap = new Map<string, string>([
	["best", "베스트"],
	["LIVING", "생활용품"],
	["living", "생활용품"],
	["INGREDIENTS", "식재료"],
	["ingredients", "식재료"],
	["OFFICE", "사무용품"],
	["office", "사무용품"],
	["CAMPING", "캠핑용품"],
	["camping", "캠핑용품"],
]);

export const getCategoryLabel = (categoryId: string): string =>
	labelMap.get(categoryId) ?? categoryId;
