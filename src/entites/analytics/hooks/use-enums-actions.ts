import { type ComboboxItem } from "@mantine/core";

const data: Record<PermittedActions, string> = {
	"=": "Равно",
	">=": "Больше",
	"<=": "Меньше",
	"!=": "Не равно",
	in: "Принадлежит",
	not_in: "Не принадлежит",
	like: "Похоже",
	or: "or",
};

const dataSelect: ComboboxItem[] = Object.entries(data).map(
	([value, label]) => ({
		value,
		label,
	}),
);

function findLabelByCode(code: PermittedActions): string {
	return data[code] || code;
}

export function useEnumsActions() {
	return {
		isLoading: false,
		data,
		dataSelect,
		findLabelByCode,
	};
}
