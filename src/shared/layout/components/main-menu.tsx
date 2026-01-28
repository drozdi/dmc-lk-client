import { Box, Group, ThemeIcon, Tooltip } from "@mantine/core";
import { useCallback } from "react";
import { TbMenu } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import classes from "./main-menu.module.css";

interface NavItem {
	label: string;
	icon?: React.ReactNode;
	path: string;
}

const navItems: NavItem[] = [
	{
		label: "Аналитика",
		icon: <TbMenu />,
		path: "/analytics",
	},
	{
		label: "Отчеты",
		icon: <TbMenu />,
		path: "/analytics/queries",
	},
	{
		label: "Инциденты за день",
		icon: <TbMenu />,
		path: "/analytics/incident/day",
	},
	{
		label: "Инциденты список",
		icon: <TbMenu />,
		path: "/analytics/incident/list",
	},
	{
		label: "Формируемые инциденты",
		icon: <TbMenu />,
		path: "/analytics/incident",
	},
	{
		label: "Labels",
		icon: <TbMenu />,
		path: "/labels",
	},
	{
		label: "Labels Count",
		icon: <TbMenu />,
		path: "/labels/count",
	},
	{
		label: "Пользователи",
		icon: <TbMenu />,
		path: "/users",
	},
];

function NavbarLink({
	icon,
	label,
	active,
	path,
	mini = false,
}: {
	icon: React.ReactNode;
	label: string;
	active: boolean;
	path: string;
	mini?: boolean;
}) {
	return (
		<Tooltip
			label={label}
			position="right"
			transitionProps={{ duration: 0 }}
			disabled={!mini}
		>
			<Group
				justify="space-between"
				gap={0}
				component={Link}
				to={path}
				className={classes.link}
				data-active={active || undefined}
				aria-label={label}
			>
				<Box style={{ display: "flex", alignItems: "center" }}>
					<ThemeIcon variant="light" size={26}>
						{icon}
					</ThemeIcon>
					{!mini && <Box ml="md">{label}</Box>}
				</Box>
			</Group>
		</Tooltip>
	);
}

export const MainMenu = ({ mini = false }: { mini?: boolean }) => {
	const location = useLocation();

	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location.pathname],
	);

	return navItems.map((nav) => (
		<NavbarLink
			key={nav.path}
			mini={mini}
			icon={nav.icon}
			label={nav.label}
			path={nav.path}
			active={isActive(nav.path)}
		/>
	));
};
