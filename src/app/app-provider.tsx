import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import 'dayjs/locale/ru'
import { Link } from 'react-router'
import { SidebarProvider, TemplateProvider, ThemeProvider } from '../components/context'
import { RenderProvider } from '../shared/internal/render'

interface AppProviderProps {
	children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<MantineProvider>
			<DatesProvider settings={{ locale: 'ru' }}>
				<Notifications />
				<RenderProvider render={({ as, to }: { to?: string; as?: any }) => (!!to ? Link : as)}>
					<ThemeProvider>
						<SidebarProvider>
							<TemplateProvider>{children}</TemplateProvider>
						</SidebarProvider>
					</ThemeProvider>
				</RenderProvider>
			</DatesProvider>
		</MantineProvider>
	)
}
