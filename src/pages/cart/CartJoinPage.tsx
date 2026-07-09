import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useJoinCart } from "../../hooks/cart/useCartMutation";

const JOIN_HANDLED_KEY = "cart_join_token_handled";

export default function CartJoinPage() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const { mutate, isPending } = useJoinCart();

	useEffect(() => {
		const token = params.get("token");

		if (!token) {
			navigate("/cart", { replace: true });
			return;
		}

		// StrictMode 이중 호출 방지: 동일 토큰이 이미 처리되었으면 무시
		const handled = sessionStorage.getItem(JOIN_HANDLED_KEY);
		if (handled === token) return;
		sessionStorage.setItem(JOIN_HANDLED_KEY, token);

		mutate(token, {
			onSuccess: (cartId) => {
				navigate(`/cart/detail?id=${cartId}`, { replace: true });
			},
			onError: () => {
				navigate("/cart", { replace: true });
			},
			onSettled: () => {
				sessionStorage.removeItem(JOIN_HANDLED_KEY);
			},
		});
	}, [params, navigate, mutate]);

	return (
		<div className="h-screen flex items-center justify-center bg-white">
			{isPending && (
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 text-sm">장바구니 참여 처리 중...</p>
				</div>
			)}
		</div>
	);
}
