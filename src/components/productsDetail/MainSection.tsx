import { ShoppingCart } from "lucide-react";
import {
	useOpenAddToCartModal,
	useOpenSelectCartModal,
} from "../../store/useCartModalStore.ts";
import { getCategoryLabel } from "../../types/product";
import { useAllCartsCount } from "../../store/useCartStore.ts";
import { useRequireAuth } from "../../hooks/auth/useRequireAuth";
import type { Product } from "../../types/product";

interface MainSectionProps {
	product: Product;
}

export default function MainSection({ product }: MainSectionProps) {
	const openAddToCartModal = useOpenAddToCartModal();
	const openSelectCartModal = useOpenSelectCartModal();
	const cartCount = useAllCartsCount();
	const { requireAuth } = useRequireAuth();

	const handleAddToCart = requireAuth(() => {
		const hasCartData = cartCount > 0;
		if (hasCartData) {
			openSelectCartModal([{ productId: product.id, quantity: 1 }]);
		} else {
			openAddToCartModal();
		}
	});

	return (
		<div className="mb-6 sm:mb-10 grid items-start gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
			<div className="mx-auto md:mx-0 w-full max-w-sm md:max-w-none overflow-hidden rounded-2xl sm:rounded-[28px] bg-[#F7F3E9]">
				<div className="aspect-square">
					<img
						src={product.image_url}
						alt={product.name}
						className="h-full w-full object-cover"
					/>
				</div>
			</div>

			<div className="flex h-full flex-col bg-white py-2 sm:py-4 lg:min-h-[620px] lg:py-6">
				<div className="mb-4 sm:mb-5">
					<span className="inline-flex rounded-full bg-[#F6F0E4] px-3 py-1 text-xs sm:text-sm font-semibold text-[#7A6E5A]">
						{getCategoryLabel(product.category)}
					</span>
				</div>

				<div className="mb-6 lg:mb-8">
					<h1 className="mb-3 lg:mb-4 text-xl sm:text-2xl lg:text-[40px] font-bold leading-tight text-gray-900">
						{product.name}
					</h1>
					<p className="text-sm sm:text-base lg:text-[17px] leading-relaxed lg:leading-8 text-gray-600">
						{product.description}
					</p>
				</div>

				<div className="mb-8 lg:mb-12 border-t border-[#ECE4D7] pt-6 lg:pt-8">
					<p className="mb-2 text-xs sm:text-sm font-medium text-gray-500">
						판매가
					</p>
					<span className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#1F2937]">
						{product.price.toLocaleString()}원
					</span>
				</div>

				<div className="mt-auto">
					<button
						onClick={handleAddToCart}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF6EC] py-3 sm:py-4 text-sm sm:text-base lg:text-[17px] font-bold text-gray-900 transition-colors hover:bg-[#F3EFE4]">
						<ShoppingCart className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
						장바구니
					</button>
				</div>
			</div>
		</div>
	);
}
