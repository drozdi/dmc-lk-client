import { BrowserRouter } from "react-router-dom";

export function ProviderRouter({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter>
			{children}
		</BrowserRouter>
	);
}
