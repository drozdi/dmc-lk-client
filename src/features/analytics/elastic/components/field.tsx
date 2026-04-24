import {
	SelectAnalyticsFields,
	useQueryAnalyticsFields,
} from "@/entites/analytics";
import { useStoreElastic } from "@/entites/analytics/stores/use-store-elastic";
import { Group, Stack, Text, type StackProps } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

interface ElasticFieldProps extends StackProps {}

export const ElasticField = (props: ElasticFieldProps) => {
	const { findLabelByCode } = useQueryAnalyticsFields();
	const { template, getDate, save, setDate } = useStoreElastic(
		useShallow((state) => ({
			template: state.template,
			getDate: state.getDate,
			setDate: state.setDate,
			save: state.save,
		})),
	);

	const date = getDate();

	const update = () => save({ ...template });

	const columns = useMemo(
		() => [
			...(template.company?.select_field || []).map((item) => ({
				accessorKey: item,
				header: findLabelByCode(item),
			})),
		],
		[template, findLabelByCode],
	);

	const handleAddSelect = (select: string) => {
		if (!select) {
			return;
		}
		template.company.select_field.push(select);
		update();
	};

	const handleDateChange = (name: string, value: any) => {
		setDate({
			[name]: value,
		});
	};

	return (
		<Stack {...props}>
			<Group>
				<Text>С</Text>
				<DatePickerInput
					name="date_from"
					value={date?.date_from}
					onChange={(value) => handleDateChange("date_from", value)}
				/>
				<Text>по</Text>
				<DatePickerInput
					name="date_to"
					value={date?.date_to}
					onChange={(value) => handleDateChange("date_to", value)}
				/>
			</Group>
			<SelectAnalyticsFields
				flex="1"
				value={""}
				excludeds={columns.map((item) => item.accessorKey)}
				onChange={(value) => handleAddSelect(value as string)}
				placeholder="Отображать"
			/>
		</Stack>
	);
};
