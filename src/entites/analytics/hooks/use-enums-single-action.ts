import { type ComboboxItem } from "@mantine/core";

const data: Record<SingleActionList, string> = {
	and: "И",
	or: "Или",
	not: "Не",
};

const dataSelect: ComboboxItem[] = Object.entries(data).map(
	([value, label]) => ({
		value,
		label,
	}),
);

function findLabelByCode(code: SingleActionList): string {
	return data[code] || code;
}

export function useEnumsSingleAction() {
	return {
		isLoading: false,
		data,
		dataSelect,
		findLabelByCode,
	};
}
