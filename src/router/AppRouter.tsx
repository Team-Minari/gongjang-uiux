import { Routes, Route } from "react-router-dom";
import GlobalLayout from "../components/layout/GlobalLayout";
import MainPage from "../pages/main/MainPage.tsx";
import LoginPage from "../pages/login/LoginPage.tsx";
import OAuthCallbackPage from "../pages/login/OAuthCallbackPage.tsx";
import ProductDetailPage from "../pages/products/ProductDetailPage.tsx";
import CategoryProductListPage from "../pages/products/CategoryProductListPage.tsx";
import CartListPage from "../pages/cart/CartListPage.tsx";
import CartDetailPage from "../pages/cart/CartDetailPage.tsx";
import CartJoinPage from "../pages/cart/CartJoinPage.tsx";
import ScrollToTop from "../components/layout/ScrollToTop.tsx";

export default function AppRouter() {
	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/oauth/kakao/callback" element={<OAuthCallbackPage />} />
				<Route path="/cart/join" element={<CartJoinPage />} />

				<Route element={<GlobalLayout />}>
					<Route path="/" element={<MainPage />} />
					<Route path="/product/:id" element={<ProductDetailPage />} />
					<Route path="/products" element={<CategoryProductListPage />} />
					<Route path="/cart" element={<CartListPage />} />
					<Route path="/cart/detail" element={<CartDetailPage />} />
				</Route>
			</Routes>
		</>
	);
}
