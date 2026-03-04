import { IncidentAll } from "@/features/analytics/incident/all";
import { Template } from "@/layout";
import { Group, Paper, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";

export function AnalyticsIncidentListPage() {
	const day = dayjs();
	const [query, setQuery] = useState<IRequestAnalyticsIncident>({
		limit_page: 1000,
		filterdate: [
			day.month(day.month() - 3).format("YYYY-MM-DD"),
			day.format("YYYY-MM-DD"),
		],
		data: [],
		fields_name: [],
		details_field: [],
	});

	function handleDate(index: number, value: string) {
		const newFilterdate = [...(query.filterdate || [])];
		newFilterdate[index] = value;
		setQuery({ ...query, filterdate: newFilterdate });
	}

	return (
		<Paper>
			<Template.Title slot="title">Инциденты</Template.Title>
			<Group justify="end">
				<Text>С</Text>
				<DatePickerInput
					name="filterdate_from"
					value={query?.filterdate?.[0] || ""}
					onChange={(value) => handleDate(0, value as string)}
				/>
				<Text>по</Text>
				<DatePickerInput
					name="filterdate_to"
					value={query?.filterdate?.[1] || ""}
					onChange={(value) => handleDate(1, value as string)}
				/>
			</Group>
			<IncidentAll mt="xs" query={query} />
		</Paper>
	);
}
