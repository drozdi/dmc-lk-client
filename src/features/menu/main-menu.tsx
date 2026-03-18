import { Box, Group, ThemeIcon, Tooltip } from "@mantine/core";
import { useCallback } from "react";
import {
	TbLabel,
	TbMenu,
	TbMessageReport,
	TbReport,
	TbReportAnalytics,
	TbUsersGroup,
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import classes from "./main-menu.module.css";

interface NavItem {
	label: string;
	icon?: React.ReactNode;
	path: string;
}

const navItems: NavItem[] = [
	{
		label: "Доска",
		icon: <TbReportAnalytics />,
		path: "/",
	},
	{
		label: "Отчеты",
		icon: <TbReport />,
		path: "/analytics/queries",
	},
	{
		label: "Инциденты",
		icon: <TbMessageReport />,
		path: "/analytics/incident",
	},
	{
		label: "Групировка этикеток",
		icon: <TbMenu />,
		path: "/labels",
	},
	{
		label: "Склад этикеток",
		icon: <TbLabel />,
		path: "/labels/count",
	},
	{
		label: "Пользователи",
		icon: <TbUsersGroup />,
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
					<ThemeIcon variant="light" size={40} fz={30}>
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

	return navItems.map((nav) =>
		nav.path ? (
			<NavbarLink
				key={nav.path}
				mini={mini}
				icon={nav.icon}
				label={nav.label}
				path={nav.path}
				active={isActive(nav.path)}
			/>
		) : null,
	);
};
