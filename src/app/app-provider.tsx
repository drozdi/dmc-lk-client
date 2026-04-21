import dayjs from "dayjs";
import "dayjs/locale/ru";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import { ProviderMantine } from "./providers/mantine";
import { ProviderQueryClient } from "./providers/query-client";
import { ProviderRouter } from "./providers/router";

interface AppProviderProps {
	children: React.ReactNode;
}

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.locale("ru");

export function AppProvider({ children }: AppProviderProps) {
	return (
		<ProviderMantine>
			<ProviderQueryClient>
				<ProviderRouter>{children}</ProviderRouter>
			</ProviderQueryClient>
		</ProviderMantine>
	);
}
