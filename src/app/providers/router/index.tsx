import { $setting } from "@/shared";
import { BrowserRouter } from "react-router-dom";

export function ProviderRouter({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter basename={$setting.get("base.url")}>
			{children}
		</BrowserRouter>
	);
}
