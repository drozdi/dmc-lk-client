import { ProtectedRoute } from "@/features/auth/protected-route";
import { AuthLayout, MainLayout } from "@t";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

import { AnalyticsElasticFormPage } from "@/pages/analytics/elastic/form-page";
import { AnalyticsIncidentDayPage } from "@/pages/analytics/incident/day-page";
import { AnalyticsIncidentFilterPage } from "@/pages/analytics/incident/filter-page";
import { AnalyticsIncidentListPage } from "@/pages/analytics/incident/list-page";
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
				path: "analytics/incident",
				element: <Outlet />,
				children: [
					{
						path: "",
						element: <AnalyticsIncidentFilterPage />,
					},
					{
						path: "list",
						element: <AnalyticsIncidentListPage />,
					},
					{
						path: "day",
						element: <AnalyticsIncidentDayPage />,
					},
				],
			},

			{
				path: "analytics/elastic",
				element: <AnalyticsElasticFormPage />,
			},
			{
				path: "analytics/queries",
				element: <AnalyticsQueryListPage />,
			},
			{
				path: "analytics/:id_query",
				element: <AnalyticsQueryItemPage />,
			},
			{
				path: 'analytics',
				element: <DashboardPage />
			}

			// {
			// 	path: "/users",
			// 	element: <Outlet />,
			// 	children: [
			// 		{
			// 			path: "",
			// 			element: <UsersPage />,
			// 		},
			// 		{
			// 			path: ":userId",
			// 			element: <UserPage />,
			// 		},
			// 	],
			// },
		],
		// children: [
		//
		// 	analyticsRouers(),
		// 	shopRouers(),
		// 	labelsRouers(),
		// ],
	},
];

export function AppRouters() {
	const routesElement = useRoutes(routes());
	return routesElement;
}
