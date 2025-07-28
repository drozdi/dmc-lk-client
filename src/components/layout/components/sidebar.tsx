import { useCallback } from 'react'
import { useLocation } from 'react-router'
import { Link as LinkRouter } from 'react-router-dom'
import { DmcLink } from '../../../shared/ui'
import { useSidebar } from '../../context/sidebar'
import { Logo } from '../../features/logo/Logo'
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
		name: 'Инциденты',
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
		name: 'Пользователи',
		path: '/users',
	},
]

const Sidebar: React.FC = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
	const location = useLocation()

	// const isActive = (path: string) => location.pathname === path;
	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location.pathname]
	)

	const renderMenuItems = (items: NavItem[]) =>
		items.map((nav, index) => (
			<DmcLink
				as={LinkRouter}
				key={nav.name}
				to={nav.path}
				label={nav.name}
				active={isActive(nav.path)}
			></DmcLink>
		))

	return (
		<aside
			className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 border-color bg-surface h-screen transition-all duration-300 ease-in-out z-50 border-r
        ${
					isExpanded || isMobileOpen
						? 'w-[290px]'
						: isHovered
						? 'w-[290px]'
						: 'w-[90px]'
				}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='py-4 flex justify-center items-center'>
				<Logo
					className={
						isMobileOpen || isExpanded || isHovered ? '' : 'scale-[0.6]'
					}
				/>
			</div>
			<div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
				<nav className='mb-6'>
					<div className='flex flex-col'>{renderMenuItems(navItems)}</div>
				</nav>
			</div>
		</aside>
	)
}

export default Sidebar
