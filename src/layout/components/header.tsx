import { useEffect, useRef } from 'react'
import { TbMenu4, TbX } from 'react-icons/tb'
import { ShopCartBtn } from '../../apps/shop/features/shop-cart-btn'
import { InOutBtn } from '../../features/auth/in-out-btn'
import { ChangeProduct } from '../../features/lk/change-product'
import { PersonalLink } from '../../features/lk/personal-link'
import { useSidebar } from '../context/sidebar'

const Header: React.FC = () => {
	const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()

	const handleToggle = () => {
		if (window.innerWidth >= 991) {
			toggleSidebar()
		} else {
			toggleMobileSidebar()
		}
	}

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault()
				inputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	return (
		<header className='sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b'>
			<div className='flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6'>
				<div className='flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4'>
					<button
						className='items-center justify-center w-10 h-10 text-2xl text-gray-500 cursor-pointer border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border'
						onClick={handleToggle}
						aria-label='Toggle Sidebar'
					>
						{isMobileOpen ? <TbX /> : <TbMenu4 />}
						{/* Cross Icon */}
					</button>
					<div className='flex gap-3 items-center'>
						<ChangeProduct />
						<PersonalLink />
						<InOutBtn />
						<ShopCartBtn />
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
