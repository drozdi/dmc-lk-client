import { type ComboboxItem } from "@mantine/core";
import { mapEvents } from "../constants";

const findByCode = (code: AnalyticEvent) => mapEvents[code];
const findLabelByCode = (code: AnalyticEvent) =>
	findByCode(code)?.label || code;
const findColorByCode = (code: AnalyticEvent) => findByCode(code)?.color || "";
const dataSelect: ComboboxItem[] = Object.entries(mapEvents || {}).map(
	([value, { label }]) => ({
		value,
		label,
	}),
);

export function useEnumsEvents() {
	return {
		isLoading: false,
		data: mapEvents,
		dataSelect,
		findByCode,
		findLabelByCode,
		findColorByCode,
	};
}
