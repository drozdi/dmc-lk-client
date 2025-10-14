import { NavLink } from '@mantine/core'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
type NavItem = {
	name: string
	icon?: React.ReactNode
	path?: string
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]
}

const navItems: NavItem[] = [
	{
		name: 'Аналитика',
		path: '/analytics',
	},
	{
		name: 'Отчеты',
		path: '/analytics/queries',
	},
	{
		name: 'Инциденты список',
		path: '/analytics/incident/list',
	},
	{
		name: 'Формируемые инциденты',
		path: '/analytics/incident',
	},
	{
		name: 'Магазин',
		path: '/shop',
	},
	{
		name: 'Labels',
		path: '/labels',
	},
	{
		name: 'Labels Count',
		path: '/labels/count',
	},
	{
		name: 'Пользователи',
		path: '/users',
	},
]

export const MainMenu = () => {
	const location = useLocation()
	const navigate = useNavigate()

	// const isActive = (path: string) => location.pathname === path;
	const isActive = useCallback((path: string) => location.pathname === path, [location.pathname])

	return navItems.map((nav, index) => (
		<NavLink key={nav.path} onClick={() => navigate(nav.path)} label={nav.name} active={isActive(nav.path)} />
	))
}
