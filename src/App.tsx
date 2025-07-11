import { AppLoader } from './app/app-loader'
import { AppProvider } from './app/app-provider'
import { AppRouters } from './app/app-routers'
function App() {
	return (
		<AppLoader>
			<AppProvider>
				<AppRouters />
			</AppProvider>
		</AppLoader>
	)
}

export default App
