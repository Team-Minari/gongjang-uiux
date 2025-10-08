export default function Header() {
	return (
		<header className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-30 flex justify-between items-center h-16">
				<p className="text-2xl font-bold text-green-500">GongJang</p>

				<nav className="flex items-center space-x-6">
					<a className="text-sm text-gray-600 hover:text-gray-900">로그인</a>

					<a className="text-sm text-gray-600 hover:text-gray-900">회원가입</a>

					<a className="text-sm text-gray-600 hover:text-gray-900">
						마이페이지
					</a>
				</nav>
			</div>
		</header>
	);
}
