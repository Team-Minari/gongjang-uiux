// ── 장바구니 타입 ──
export type CartType = "PERSONAL" | "SHARED";

// 백엔드 global.enums.Category와 동일
export type CartCategory =
	| "BEST"
	| "LIVING"
	| "INGREDIENTS"
	| "OFFICE"
	| "CAMPING";

export const CART_CATEGORIES: { value: CartCategory; label: string }[] = [
	{ value: "BEST", label: "베스트" },
	{ value: "LIVING", label: "생활용품" },
	{ value: "INGREDIENTS", label: "식재료" },
	{ value: "OFFICE", label: "사무용품" },
	{ value: "CAMPING", label: "캠핑용품" },
];

// ── 백엔드 응답 DTO ──

/** GET /api/carts/me, GET /api/carts 목록 아이템 */
export interface CartResponse {
	id: number;
	name: string;
	category: CartCategory;
	purpose: string | null;
	is_public: boolean;
	budget: number | null;
	owner_id: number;
	cart_type: CartType;
}

/** GET /api/carts/{cartId} 상세 */
export interface CartDetailResponse extends CartResponse {
	link_token: string;
}

/** GET /api/carts/{cartId}/items 아이템 */
export interface CartItemResponse {
	id: number;
	product_id: number;
	product_name: string;
	price: number;
	image_url: string;
	quantity: number;
	checked: boolean;
	checker_id: number | null;
}

/** GET /api/carts/{cartId}/participants 참여자 */
export interface ParticipantResponse {
	member_id: number;
	username: string;
	profile_image_url: string | null;
}

// ── 백엔드 요청 DTO ──

/** POST /api/carts 장바구니 생성 */
export interface CreateCartRequest {
	name: string;
	category: CartCategory;
	purpose?: string;
	is_public: boolean;
	budget?: number | null;
	cart_type: CartType;
}

/** PATCH /api/carts/{cartId}/settings 장바구니 설정 수정 */
export interface UpdateCartSettingRequest {
	cart_name?: string;
	is_public?: boolean;
	category?: CartCategory;
	purpose?: string;
	budget?: number | null;
}

/** POST /api/carts/{cartId}/items 아이템 추가 */
export interface AddCartItemRequest {
	product_id: number;
	quantity: number;
}

/** PATCH /api/carts/{cartId}/items/{itemId} 수량 수정 */
export interface UpdateCartItemRequest {
	quantity: number;
}

/** PATCH /api/carts/{cartId}/owner 소유권 이전 */
export interface OwnerTransferRequest {
	new_owner_id: number;
}

/** 소유권 이전 응답 */
export interface OwnerTransferResponse {
	prev_owner_id: number;
	new_owner_id: number;
	new_owner_name: string;
}

/** POST /api/carts/search 자연어 검색 */
export interface CartSearchRequest {
	query: string;
}
