import { ProtectedRoute } from "@/features/auth/protected-route";
import { AuthLayout, MainLayout } from "@t";
import { Navigate, useRoutes } from "react-router-dom";

import { SignInPage } from "../pages/auth/sign-in-page";
import { SignOutPage } from "../pages/auth/sign-out-page";
import { SignUpPage } from "../pages/auth/sign-up-page";
import { VerificationPage } from "../pages/auth/verification-page";

const routes = () => [
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{
				path: "",
				element: <Navigate to="/auth/sign-in" />,
			},
			{
				path: "verificatin",
				element: <VerificationPage />,
			},
			{
				path: "sign-in",
				element: <SignInPage />,
			},
			{
				path: "sign-up",
				element: <SignUpPage />,
			},
			{
				path: "sign-out",
				element: <SignOutPage />,
			},
		],
	},
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		// children: [
		// 	{
		// 		path: "",
		// 		element: <MainPage />,
		// 	},
		// 	{
		// 		path: "/lk",
		// 		element: <PersonalPage />,
		// 	},
		// 	analyticsRouers(),
		// 	shopRouers(),
		// 	usersRouers(),
		// 	labelsRouers(),
		// ],
	},
];

export function AppRouters() {
	const routesElement = useRoutes(routes());
	return routesElement;
}
