import { ProtectedRoute } from "@/features/auth/protected-route";
import { AuthLayout, MainLayout } from "@/layout";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

import { AnalyticsElasticFormPage } from "@/pages/analytics/elastic/form-page";
import { AnalyticsIncidentPage } from "@/pages/analytics/incident";
import { AnalyticsQueryItemPage } from "@/pages/analytics/query/item-page";
import { AnalyticsQueryListPage } from "@/pages/analytics/query/list-page";
import { DashboardPage } from "@/pages/dashboard-page";

import { SignInPage } from "@/pages/auth/sign-in-page";
import { SignOutPage } from "@/pages/auth/sign-out-page";
import { SignUpPage } from "@/pages/auth/sign-up-page";
import { VerificationPage } from "@/pages/auth/verification-page";
import { LabelsCountPage } from "@/pages/labels/lables-count-page";
import { LabelsPage } from "@/pages/labels/lables-page";
import { MainPage } from "@/pages/main-page";
import { PersonalPage } from "@/pages/personal-page";
import { UsersListPage } from "@/pages/users/list-page";
import { UsersUserPage } from "@/pages/users/user-page";

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
		children: [
			{
				path: "",
				element: <MainPage />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "lk",
				element: <PersonalPage />,
			},
			{
				path: "labels",
				element: <LabelsPage />,
			},
			{
				path: "labels/count",
				element: <LabelsCountPage />,
			},
			{
				path: "analytics",
				element: <Outlet />,
				children: [
					{
						path: "incident",
						element: <AnalyticsIncidentPage />,
					},
					{
						path: "elastic",
						element: <AnalyticsElasticFormPage />,
					},
					{
						path: "queries",
						element: <AnalyticsQueryListPage />,
					},
					{
						path: ":id_query",
						element: <AnalyticsQueryItemPage />,
					},
				],
			},
			{
				path: "users",
				element: <Outlet />,
				children: [
					{
						path: "",
						element: <UsersListPage />,
					},
					{
						path: ":userId",
						element: <UsersUserPage />,
					},
				],
			},
		],
	},
];

export function AppRouters() {
	const routesElement = useRoutes(routes());
	return routesElement;
}
