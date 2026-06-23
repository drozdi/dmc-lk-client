import { ProtectedRoute } from "@/features/auth/protected-route";
import { AuthLayout, MainLayout } from "@/layout";
import { Center, Loader } from "@mantine/core";
import { lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation, useRoutes } from "react-router-dom";

import { DashboardPage } from "@/pages/dashboard-page";

import { SignInPage } from "@/pages/auth/sign-in-page";
import { SignOutPage } from "@/pages/auth/sign-out-page";
import { SignUpPage } from "@/pages/auth/sign-up-page";
import { VerificationPage } from "@/pages/auth/verification-page";
import { LabelsHistoryPage } from "@/pages/labels/lables-history-page";
import { LabelsPage } from "@/pages/labels/lables-page";
import { MainPage } from "@/pages/main-page";
import { PersonalPage } from "@/pages/personal-page";
import { TablePage } from "@/pages/table";
import { UsersListPage } from "@/pages/users/list-page";
import { UsersUserPage } from "@/pages/users/user-page";

const AnalyticsIncidentPage = lazy(() =>
	import("@/pages/analytics/incident").then((module) => ({
		default: module.AnalyticsIncidentPage,
	})),
);
const AnalyticsElasticFormPage = lazy(() =>
	import("@/pages/analytics/elastic/form-page").then((module) => ({
		default: module.AnalyticsElasticFormPage,
	})),
);
const AnalyticsQueryListPage = lazy(() =>
	import("@/pages/analytics/query/list-page").then((module) => ({
		default: module.AnalyticsQueryListPage,
	})),
);
const AnalyticsQueryItemPage = lazy(() =>
	import("@/pages/analytics/query/item-page").then((module) => ({
		default: module.AnalyticsQueryItemPage,
	})),
);

function PageSuspense({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<Center mih={320}>
					<Loader />
				</Center>
			}
		>
			{children}
		</Suspense>
	);
}

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
			import.meta.env.DEV && {
				path: "table",
				element: <TablePage />,
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
				path: "labels/history",
				element: <LabelsHistoryPage />,
			},
			{
				path: "analytics",
				element: <Outlet />,
				children: [
					{
						path: "incident",
						element: (
							<PageSuspense>
								<AnalyticsIncidentPage />
							</PageSuspense>
						),
					},
					{
						path: "elastic",
						element: (
							<PageSuspense>
								<AnalyticsElasticFormPage />
							</PageSuspense>
						),
					},
					{
						path: "queries",
						element: (
							<PageSuspense>
								<AnalyticsQueryListPage />
							</PageSuspense>
						),
					},
					{
						path: ":id_query",
						element: (
							<PageSuspense>
								<AnalyticsQueryItemPage />
							</PageSuspense>
						),
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

function RequireTrailingSlash({ children }: { children: JSX.Element }) {
	const location = useLocation();
	const pathname = location.pathname;

	if (pathname !== "/" && !pathname.endsWith("/")) {
		const newPathname = `${pathname}/`;
		return <Navigate to={{ ...location, pathname: newPathname }} replace />;
	}

	return children;
}

export function AppRouters() {
	const routesElement = useRoutes(routes());
	return <RequireTrailingSlash>{routesElement}</RequireTrailingSlash>;
}
