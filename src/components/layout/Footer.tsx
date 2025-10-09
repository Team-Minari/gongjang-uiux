import Header from "./Header.tsx";

export default function Footer() {
	return (
		<>
			<Header />
			<footer className="bg-green-400 text-white">
				<div className="max-w-7xl mx-auto px-30">
					<div className="mx-auto w-full max-w-screen-xl px-6 py-10 md:px-8 md:py-16">
						<div className="flex flex-col items-center gap-y-8 text-center">
							<div className="flex flex-col gap-y-4 md:flex-row md:gap-x-12">
								<button type="button">About</button>
								<button type="button">Contact</button>
								<button type="button">Privacy Policy</button>
								<button type="button">Terms of Service</button>
							</div>
							<div>
								<p>@2026 Stage Access. All rights reserved.</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
