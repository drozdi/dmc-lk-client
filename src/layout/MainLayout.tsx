import { Outlet } from 'react-router-dom'
import Header from './components/header'
import Sidebar from './components/sidebar'
import { useSidebar } from './context'

export function MainLayout() {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar()
	return (
		<div className='min-h-screen xl:flex'>
			<div>
				<Sidebar />
			</div>
			<div
				className={`flex-1 transition-all duration-300 ease-in-out min-h-screen ${
					isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
				} ${isMobileOpen ? 'ml-0' : ''}`}
			>
				<Header />
				<div className='p-4 mx-auto max-w-screen-2xl md:p-6'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
