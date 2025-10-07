import { AppShell, Burger, Button, Group, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, useNavigate } from 'react-router-dom'
import { ShopCart } from '../apps/shop/features/shop-cart'
import { PersonalLink } from '../features/lk/personal-link'
import { Logo } from '../features/logo/Logo'
import { Footer } from './components/footer'
import Header from './components/header'
import { Sidebar } from './components/sidebar'
import { ThemeBtn } from './components/theme-btn'
import { useSidebar } from './context'
import { TemplateSlot } from './context/template'

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

export function MainLayout_() {
	const navigate = useNavigate()
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
	return (
		<AppShell
			padding='md'
			layout='alt'
			header={{ height: { base: 60, md: 70, lg: 80 } }}
			footer={{ height: 60 }}
			navbar={{
				width: { base: 200, md: 300 },
				breakpoint: 'sm',
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
		>
			<AppShell.Header>
				<Group h='100%' px='md' justify='space-between'>
					<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
					<Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
					<Group>
						<PersonalLink />
						<ThemeBtn />
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar>
				<AppShell.Section p='md'>
					<Logo />
				</AppShell.Section>
				<AppShell.Section grow my='md' component={ScrollArea} px='md'>
					<Sidebar />
				</AppShell.Section>
				<AppShell.Section p='md'>Navbar footer – always at the bottom</AppShell.Section>
			</AppShell.Navbar>
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
			<AppShell.Footer component={Group} justify='space-between' gap='xs' px='xs'>
				<TemplateSlot name='footer'>
					<div></div>
				</TemplateSlot>
				<Button color='dark' size='sm' onClick={() => navigate(-1)}>
					Назад
				</Button>
			</AppShell.Footer>
		</AppShell>
	)
}
