export default function Header() {
	return (
		<header className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-30 flex justify-between items-center h-16">
				<button type="button" className="text-2xl font-bold text-green-500">
					GongJang
				</button>

				<nav className="flex items-center space-x-6">
					<button
						type="button"
						className="text-sm text-gray-600 hover:text-gray-800">
						로그인
					</button>

					<button
						type="button"
						className="text-sm text-gray-600 hover:text-gray-800">
						회원가입
					</button>

					<button
						type="button"
						className="text-sm text-gray-600 hover:text-gray-800">
						마이페이지
					</button>
				</nav>
			</div>
		</header>
	);
}
