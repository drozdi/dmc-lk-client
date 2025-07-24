import { Link } from 'react-router'
import {
	SidebarProvider,
	TemplateProvider,
	ThemeProvider,
} from '../layout/context'
import { RenderProvider } from '../shared/internal/render'

interface AppProviderProps {
	children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<RenderProvider render={({ as, to }) => (!!to ? Link : as)}>
			<ThemeProvider>
				<SidebarProvider>
					<TemplateProvider>{children}</TemplateProvider>
				</SidebarProvider>
			</ThemeProvider>
		</RenderProvider>
	)
}
