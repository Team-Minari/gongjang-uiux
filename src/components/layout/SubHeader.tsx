import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToggleSidebar } from "../../store/useCartModalStore.ts";
import { useIsAuthenticated } from "../../store/auth/useAuthStore";
import { useLogout } from "../../hooks/auth/useAuth";
import InvitationBell from "./InvitationBell";

export default function SubHeader() {
	const toggleSidebar = useToggleSidebar();
	const navigate = useNavigate();
	const isAuthenticated = useIsAuthenticated();
	const logout = useLogout();

	const handleNavigateHome = () => {
		navigate("/");
	};

	const handleAuth = () => {
		if (isAuthenticated) {
			logout.mutate();
		} else {
			navigate("/login");
		}
	};

	const handleNavigateMyPage = () => {
		alert("마이페이지는 현재 구현 예정입니다.");
	};

	const handleToggleCart = () => {
		toggleSidebar();
	};

	return (
		<header className="h-10 sm:h-12 bg-white border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between">
				<section className="flex items-center gap-2" />

				<section className="flex items-center gap-0.5 sm:gap-1">
					<InvitationBell />
					<button
						onClick={handleNavigateHome}
						className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors">
						홈
					</button>
					<button
						onClick={handleNavigateMyPage}
						className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors">
						마이페이지
					</button>
					<button
						onClick={handleAuth}
						className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors">
						{isAuthenticated ? "로그아웃" : "로그인"}
					</button>
					<button
						onClick={handleToggleCart}
						className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1">
						<ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						<span className="hidden sm:inline">장바구니</span>
					</button>
				</section>
			</div>
		</header>
	);
}
