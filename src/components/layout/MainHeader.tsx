import { ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { categories } from "../../types/product";

export default function MainHeader() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const go = (path: string) => {
		setIsMenuOpen(false);
		navigate(path);
	};

	useEffect(() => {
		if (!isMenuOpen) return;
		const onMouseDown = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsMenuOpen(false);
			}
		};
		window.addEventListener("mousedown", onMouseDown);
		return () => window.removeEventListener("mousedown", onMouseDown);
	}, [isMenuOpen]);

	return (
		<header className="bg-[#F7F3E9] border-b border-[#E8E2D0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
				{/* 상단: 로고 + 햄버거(모바일) */}
				<div className="flex items-center justify-between mb-4 lg:mb-5">
					<div
						className="flex items-center gap-2 sm:gap-3 cursor-pointer"
						onClick={() => navigate("/")}>
						<ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-gray-900" />
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-gray-900">
								Mise
							</span>
							<span className="text-lg sm:text-xl lg:text-3xl font-normal text-gray-800">
								Prep
							</span>
						</div>
					</div>

					{/* 모바일/태블릿 햄버거 */}
					<div ref={menuRef} className="relative lg:hidden">
						<button
							onClick={() => setIsMenuOpen((v) => !v)}
							aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
							className="rounded-md p-2 text-gray-800 hover:bg-white/60 transition-colors">
							{isMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>

						{isMenuOpen && (
							<div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E8E2D0] bg-white shadow-xl z-50 py-2">
								<button
									onClick={() => go("/cart")}
									className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-[#F7F3E9]">
									장바구니
								</button>
								<button
									onClick={() => go("/products")}
									className="block w-full px-4 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-[#F7F3E9]">
									전체
								</button>
								<div className="my-1 border-t border-[#F0EBE0]" />
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => go(`/products?category=${cat.id}`)}
										className="block w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-[#F7F3E9]">
										{cat.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* 데스크탑 네비 */}
				<nav className="hidden lg:flex items-center gap-9 text-base">
					<button
						onClick={() => navigate("/cart")}
						className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
						<span>장바구니</span>
					</button>
					<button
						onClick={() => navigate("/products")}
						className="px-3 py-1.5 text-gray-800 hover:text-gray-900 hover:bg-gray-100 font-medium rounded transition-colors">
						전체
					</button>
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => navigate(`/products?category=${cat.id}`)}
							className="px-3 py-1.5 text-gray-800 hover:text-gray-900 hover:bg-gray-100 font-medium rounded transition-colors">
							{cat.label}
						</button>
					))}
				</nav>
			</div>
		</header>
	);
}
