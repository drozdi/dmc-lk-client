import { NavLink } from "@mantine/core";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
type NavItem = {
	name: string;
	icon?: React.ReactNode;
	path: string;
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
	{
		name: "Аналитика",
		path: "/analytics",
	},
	{
		name: "Отчеты",
		path: "/analytics/queries",
	},
	{
		name: "Инциденты за день",
		path: "/analytics/incident/day",
	},
	{
		name: "Инциденты список",
		path: "/analytics/incident/list",
	},
	{
		name: "Формируемые инциденты",
		path: "/analytics/incident",
	},
	{
		name: "Labels",
		path: "/labels",
	},
	{
		name: "Labels Count",
		path: "/labels/count",
	},
	{
		name: "Пользователи",
		path: "/users",
	},
];

export const MainMenu = () => {
	const location = useLocation();

	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location.pathname],
	);

	return navItems.map((nav) => (
		<NavLink<Link>
			component={Link}
			to={nav.path}
			key={nav.path}
			label={nav.name}
			active={isActive(nav.path)}
		/>
	));
};
