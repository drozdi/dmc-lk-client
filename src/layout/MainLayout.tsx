import { Outlet } from 'react-router-dom'
import { ShopCart } from '../apps/shop/features/shop-cart'
import { useSidebar } from '../components/context'
import { Footer } from './components/footer'
import Header from './components/header'
import Sidebar from './components/sidebar'

export function MainLayout() {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar()
	return (
		<div className='min-h-screen xl:flex'>
			<Sidebar />
			<div
				className={`flex-1 relative transition-all duration-300 ease-in-out min-h-screen ${
					isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
				} ${isMobileOpen ? 'ml-0' : ''}`}
			>
				<Header />
				<div className='relative overflow-hidden pb-16'>
					<div className='p-3 mx-auto max-w-screen-2xl md:p-6'>
						<Outlet />
					</div>
					<ShopCart />
				</div>
				<Footer />
			</div>
		</div>
	)
}
