import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { themeMantine } from "./theme";

dayjs.extend(localizedFormat);
dayjs.locale("ru");

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
