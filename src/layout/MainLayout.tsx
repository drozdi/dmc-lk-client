import { AppShell, Burger, Button, Container, Group, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, useNavigate } from 'react-router-dom'
import { InOutLink } from '../features/auth/in-out-link'
import { ChangeProduct } from '../features/lk/change-product'
import { PersonalLink } from '../features/lk/personal-link'
import { Logo } from '../features/logo/Logo'
import { MainMenu } from './components/main-menu'
import { ThemeBtn } from './components/theme-btn'
import { TemplateSlot } from './context/template'

export function MainLayout() {
	const navigate = useNavigate()
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
	return (
		<AppShell
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
						<ChangeProduct />
						<InOutLink />
						<PersonalLink />
						<ThemeBtn />
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar>
				<AppShell.Section p='xs'>
					<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
					<Logo />
				</AppShell.Section>
				<AppShell.Section grow my='xs' component={ScrollArea} px='xs'>
					<MainMenu />
				</AppShell.Section>
				<AppShell.Section p='xs'>Navbar footer – always at the bottom</AppShell.Section>
			</AppShell.Navbar>
			<AppShell.Main>
				<ScrollArea h={`calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))`}>
					<Container size='xl' p='md'>
						<TemplateSlot name='notification' />
						<Outlet />
					</Container>
				</ScrollArea>
			</AppShell.Main>
			<AppShell.Footer<Group> component={Group} justify='space-between' gap='xs' px='xs'>
				<TemplateSlot name='footer'>
					<div></div>
					<Button color='dark' size='sm' onClick={() => navigate(-1)}>
						Назад
					</Button>
				</TemplateSlot>
			</AppShell.Footer>
		</AppShell>
	)
}
