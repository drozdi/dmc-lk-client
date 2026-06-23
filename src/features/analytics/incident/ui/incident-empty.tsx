import { $setting } from "@/shared";
import { EmptyState } from "@/shared/ui";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";

export const INCIDENT_EMPTY_TITLE = "Инциденты не найдены";
export const INCIDENT_EMPTY_HINT =
	"За выбранный период записей нет. Попробуйте расширить диапазон дат или изменить фильтры.";

export function IncidentEmpty({
	filterdate,
	title = INCIDENT_EMPTY_TITLE,
	hint = INCIDENT_EMPTY_HINT,
}: {
	filterdate: [DateValue, DateValue];
	title?: string;
	hint?: string;
}) {
	const format = $setting.get("formatDate");
	const from = dayjs(filterdate[0]).format(format);
	const to = dayjs(filterdate[1]).format(format);

	return (
		<EmptyState
			title={title}
			description={
				<>
					{hint}
					<br />
					Период: {from} — {to}
				</>
			}
		/>
	);
}
