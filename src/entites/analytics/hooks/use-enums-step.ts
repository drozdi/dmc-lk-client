import { type ComboboxItem } from "@mantine/core";
import { mapStep } from "../constants";

const findByCode = (code: string) => mapStep[code];
const findLabelByCode = (code: string) => findByCode(code) || code;
const dataSelect: ComboboxItem[] = Object.entries(mapStep || {}).map(
	([value, label]) => ({
		value,
		label,
	}),
);

export function useEnumsStep() {
	return {
		isLoading: false,
		data: mapStep,
		dataSelect,
		findByCode,
		findLabelByCode,
	};
}
