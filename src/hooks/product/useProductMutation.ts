import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeProduct, unlikeProduct } from "../../api/product/productApi";
import { PRODUCT_KEYS } from "./useProduct";

/** 상품 좋아요 */
export const useLikeProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: number) => likeProduct(productId),
		onSuccess: (_data, productId) => {
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
			queryClient.invalidateQueries({
				queryKey: PRODUCT_KEYS.detail(productId),
			});
		},
	});
};

/** 상품 좋아요 취소 */
export const useUnlikeProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: number) => unlikeProduct(productId),
		onSuccess: (_data, productId) => {
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
			queryClient.invalidateQueries({
				queryKey: PRODUCT_KEYS.detail(productId),
			});
		},
	});
};
