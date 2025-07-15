import { Link } from 'react-router-dom'
import { SidebarProvider, ThemeProvider } from '../layout/context'
import { RenderProvider } from '../shared/internal/render'
interface AppProviderProps {
	children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<RenderProvider as={Link}>
			<ThemeProvider>
				<SidebarProvider>{children}</SidebarProvider>
			</ThemeProvider>
		</RenderProvider>
	)
}
