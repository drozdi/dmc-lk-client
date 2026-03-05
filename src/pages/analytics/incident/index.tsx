import {
	useEnumsDetails,
	useEnumsFields,
	useStoreIncident,
} from "@/entites/analytics";
import { IncidentDetail } from "@/features/analytics/incident/detail";
import { IncidentGenerate } from "@/features/analytics/incident/generate";
import { Template } from "@/layout";
import { useQueryLoading } from "@/shared/hooks";
import { Button, Group, Paper, Tabs } from "@mantine/core";
import { DatePickerInput, type DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function AnalyticsIncidentPage() {
	const [searchParams] = useSearchParams();

	const fromDay = dayjs(
		searchParams.get("from") || dayjs().day(dayjs().day() - 7),
	);
	const toDay = dayjs(searchParams.get("to") || fromDay.day(fromDay.day() + 7));

	const [filterdate, setFilterdate] = useState<[DateValue, DateValue]>([
		fromDay.format("YYYY-MM-DD"),
		toDay.format("YYYY-MM-DD"),
	]);

	const storeIncident = useStoreIncident();

	const ef = useEnumsFields();
	const ed = useEnumsDetails();

	const isLoading = useQueryLoading(storeIncident, ef, ed);

	const handleYesterday = () => {
		setFilterdate([
			dayjs().day(-1).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleWeek = () => {
		setFilterdate([
			dayjs().day(-7).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	const handleMonth = () => {
		setFilterdate([
			dayjs().day(-28).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		]);
	};
	console.log(filterdate);
	return (
		<Paper>
			<Template.Title>Жупнал инцидентов</Template.Title>
			<Group justify="flex-end">
				<DatePickerInput
					type="range"
					value={filterdate}
					onChange={setFilterdate}
				/>
			</Group>
			<Tabs defaultValue="short" mt="xs">
				<Tabs.List>
					<Tabs.Tab value="short">Кратко</Tabs.Tab>
					<Tabs.Tab value="detail">Детально</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="short">
					<IncidentDetail filterdate={filterdate} />
				</Tabs.Panel>
				<Tabs.Panel value="detail">
					<IncidentGenerate filterdate={filterdate} />
				</Tabs.Panel>
			</Tabs>
			<Template.Footer>
				<Group>
					<Button loading={isLoading} onClick={handleYesterday}>
						Вчера
					</Button>
					<Button loading={isLoading} onClick={handleWeek}>
						Неделя
					</Button>
					<Button loading={isLoading} onClick={handleMonth}>
						Месяц
					</Button>
				</Group>
			</Template.Footer>
		</Paper>
	);
}
