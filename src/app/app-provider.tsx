import { SidebarProvider, ThemeProvider } from '../layout/context'

interface AppProviderProps {
	children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<ThemeProvider>
			<SidebarProvider>{children}</SidebarProvider>
		</ThemeProvider>
	)
}
