import { Link } from 'react-router'
import {
	FooterProvider,
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
					<FooterProvider>
						<TemplateProvider>{children}</TemplateProvider>
					</FooterProvider>
				</SidebarProvider>
			</ThemeProvider>
		</RenderProvider>
	)
}
