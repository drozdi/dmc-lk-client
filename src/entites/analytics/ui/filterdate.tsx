import { $setting } from "@/shared";
import { DualCalendarRange } from "@/shared/ui";
import { type DateValue } from "@mantine/dates";
import dayjs from "dayjs";

interface FilterdateProps {
	value?: [DateValue, DateValue];
	onChange?: (val: [DateValue, DateValue]) => void;
	editable?: boolean;
}

export function Filterdate({ value, editable, onChange }: FilterdateProps) {
	if (!editable && value?.[0]) {
		return (
			dayjs(value[0]).format($setting.get("formatDate")) +
			" - " +
			dayjs(value[1] || "").format($setting.get("formatDate"))
		);
	}
	return (
		<DualCalendarRange
			value={value}
			onChange={(value) => {
				if (value[0] && value[1]) {
					onChange?.(value);
				}
			}}
		/>
		// <DatePickerInput
		// 	type="range"
		// 	placeholder="Pick dates range"
		// 	value={filterdate}
		// 	onChange={onChange}
		// />
	);
}
