import "dayjs/locale/ru";
import { ProviderMantine } from "./providers/mantine";
import { ProviderQueryClient } from "./providers/query-client";
import { ProviderRouter } from "./providers/router";

interface AppProviderProps {
	children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<ProviderMantine>
			<ProviderQueryClient>
				<ProviderRouter>{children}</ProviderRouter>
			</ProviderQueryClient>
		</ProviderMantine>
	);
}
