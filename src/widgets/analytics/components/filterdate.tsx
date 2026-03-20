import { $setting } from "@/shared";
import { type DateValue } from "@mantine/dates";
import { DualCalendarRange } from "@ui";
import dayjs from "dayjs";

interface FilterdateProps {
	filterdate?: [DateValue, DateValue];
	onChange?: (val: [DateValue, DateValue]) => void;
	editable?: boolean;
}

export function Filterdate({
	filterdate,
	editable,
	onChange,
}: FilterdateProps) {
	if (!editable && filterdate?.[0]) {
		return (
			dayjs(filterdate[0]).format($setting.get("formatDate")) +
			" - " +
			dayjs(filterdate[1] || "").format($setting.get("formatDate"))
		);
	}
	return (
		<DualCalendarRange value={filterdate} onChange={onChange} />
		// <DatePickerInput
		// 	type="range"
		// 	placeholder="Pick dates range"
		// 	value={filterdate}
		// 	onChange={onChange}
		// />
	);
}
