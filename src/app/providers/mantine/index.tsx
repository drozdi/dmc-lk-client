import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { themeMantine } from "./theme";

export function ProviderMantine({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider theme={themeMantine}>
			<DatesProvider settings={{ locale: "ru" }}>
				<Notifications />
				<ModalsProvider>{children}</ModalsProvider>
			</DatesProvider>
		</MantineProvider>
	);
}
