import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createCart,
	updateCartSettings,
	deleteCart,
	leaveCart,
	addCartItem,
	updateCartItem,
	deleteCartItem,
	deleteAllCartItems,
	checkCartItem,
	uncheckCartItem,
	kickParticipant,
	transferOwnership,
	joinCart,
	likeCart,
	unlikeCart,
} from "../../api/cart/cartApi";
import { CART_KEYS } from "./useCart";
import type {
	CreateCartRequest,
	UpdateCartSettingRequest,
	AddCartItemRequest,
	UpdateCartItemRequest,
	OwnerTransferRequest,
} from "../../types/cart";

/** 장바구니 생성 */
export const useCreateCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateCartRequest) => createCart(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
		},
	});
};

/** 장바구니 설정 수정 */
export const useUpdateCartSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			cartId,
			body,
		}: {
			cartId: number;
			body: UpdateCartSettingRequest;
		}) => updateCartSettings(cartId, body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.detail(variables.cartId),
			});
		},
	});
};

/** 장바구니 삭제 */
export const useDeleteCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartId: number) => deleteCart(cartId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
		},
	});
};

/** 장바구니 나가기 */
export const useLeaveCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartId: number) => leaveCart(cartId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
		},
	});
};

// ── 아이템 Mutation ──

/** 아이템 추가 */
export const useAddCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			cartId,
			body,
		}: {
			cartId: number;
			body: AddCartItemRequest;
		}) => addCartItem(cartId, body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables.cartId),
			});
		},
	});
};

/** 아이템 수량 수정 */
export const useUpdateCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			cartId,
			itemId,
			body,
		}: {
			cartId: number;
			itemId: number;
			body: UpdateCartItemRequest;
		}) => updateCartItem(cartId, itemId, body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables.cartId),
			});
		},
	});
};

/** 아이템 삭제 */
export const useDeleteCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ cartId, itemId }: { cartId: number; itemId: number }) =>
			deleteCartItem(cartId, itemId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables.cartId),
			});
		},
	});
};

/** 전체 아이템 삭제 */
export const useDeleteAllCartItems = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartId: number) => deleteAllCartItems(cartId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables),
			});
		},
	});
};

/** 아이템 체크 */
export const useCheckCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ cartId, itemId }: { cartId: number; itemId: number }) =>
			checkCartItem(cartId, itemId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables.cartId),
			});
		},
	});
};

/** 아이템 체크 해제 */
export const useUncheckCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ cartId, itemId }: { cartId: number; itemId: number }) =>
			uncheckCartItem(cartId, itemId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.items(variables.cartId),
			});
		},
	});
};

// ── 참여자 관리 Mutation ──

/** 참여자 강퇴 */
export const useKickParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			cartId,
			targetMemberId,
		}: {
			cartId: number;
			targetMemberId: number;
		}) => kickParticipant(cartId, targetMemberId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.participants(variables.cartId),
			});
		},
	});
};

/** 소유권 이전 */
export const useTransferOwnership = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			cartId,
			body,
		}: {
			cartId: number;
			body: OwnerTransferRequest;
		}) => transferOwnership(cartId, body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.detail(variables.cartId),
			});
			queryClient.invalidateQueries({
				queryKey: CART_KEYS.participants(variables.cartId),
			});
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
		},
	});
};

/** 초대 링크로 참여 */
export const useJoinCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (token: string) => joinCart(token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.myList() });
		},
	});
};

// ── 좋아요 Mutation ──

/** 장바구니 좋아요 */
export const useLikeCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartId: number) => likeCart(cartId),
		onSuccess: (_data, cartId) => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
			queryClient.invalidateQueries({ queryKey: CART_KEYS.detail(cartId) });
		},
	});
};

/** 장바구니 좋아요 취소 */
export const useUnlikeCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartId: number) => unlikeCart(cartId),
		onSuccess: (_data, cartId) => {
			queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
			queryClient.invalidateQueries({ queryKey: CART_KEYS.detail(cartId) });
		},
	});
};
