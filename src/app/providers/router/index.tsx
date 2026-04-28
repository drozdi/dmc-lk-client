import { BrowserRouter } from "react-router-dom";

export function ProviderRouter({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter basename={import.meta.env.DEV ? "/" : "/lk/"}>
			{children}
		</BrowserRouter>
	);
}
