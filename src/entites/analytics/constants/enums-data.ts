import { type ComboboxItem } from "@mantine/core";
import { mapEvents, mapStep } from "../constants";

export const eventsFindByCode = (code: AnalyticEvent) => mapEvents[code];
export const eventsFindLabelByCode = (code: AnalyticEvent) =>
	eventsFindByCode(code)?.label || code;
export const eventsFindColorByCode = (code: AnalyticEvent) =>
	eventsFindByCode(code)?.color || "";

export const eventsDataSelect: ComboboxItem[] = Object.entries(mapEvents).map(
	([value, { label }]) => ({
		value,
		label,
	}),
);

export const stepFindByCode = (code: string) => mapStep[code];
export const stepFindLabelByCode = (code: string) =>
	stepFindByCode(code) || code;

export const stepDataSelect: ComboboxItem[] = Object.entries(mapStep).map(
	([value, label]) => ({
		value,
		label,
	}),
);
