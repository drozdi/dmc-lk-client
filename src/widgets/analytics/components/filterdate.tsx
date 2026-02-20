import { $setting } from "@/shared";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";

interface FilterdateProps {
	filterdate?: string[];
	filterdate_from?: string;
	filterdate_to?: string;
	onChange?: (val: Array<string | null>) => void;
	editable?: boolean;
}

export function Filterdate({
	filterdate_from,
	filterdate_to,
	editable,
	onChange,
}: FilterdateProps) {
	if (!editable && filterdate_from) {
		return (
			dayjs(filterdate_from).format($setting.get("formatDate")) +
			" - " +
			dayjs(filterdate_to || "").format($setting.get("formatDate"))
		);
	}
	return (
		<DatePickerInput
			type="range"
			placeholder="Pick dates range"
			value={[filterdate_from || "", filterdate_to || ""]}
			onChange={onChange}
		/>
	);
}
