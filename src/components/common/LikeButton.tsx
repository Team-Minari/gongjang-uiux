import { Heart } from "lucide-react";

interface LikeButtonProps {
	liked: boolean;
	count: number;
	onToggle: () => void;
	disabled?: boolean;
	className?: string;
}

/** 상품/장바구니 카드·상세에서 공용으로 쓰는 좋아요 버튼 */
export default function LikeButton({
	liked,
	count,
	onToggle,
	disabled,
	className = "",
}: LikeButtonProps) {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggle();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={disabled}
			aria-label={liked ? "좋아요 취소" : "좋아요"}
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 ${className}`}>
			<Heart
				className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
			/>
			<span>{count}</span>
		</button>
	);
}
