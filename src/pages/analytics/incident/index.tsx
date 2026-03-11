import {
	useEnumsDetails,
	useEnumsFields,
	useStoreIncident,
} from "@/entites/analytics";
import { IncidentDetail } from "@/features/analytics/incident/detail";
import { IncidentGenerate } from "@/features/analytics/incident/generate";
import { IncidentShort } from "@/features/analytics/incident/short";
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

	const [defFilterdate, setDefFilterdate] = useState<[DateValue, DateValue]>([
		fromDay.format("YYYY-MM-DD"),
		toDay.format("YYYY-MM-DD"),
	]);

	const [filterdate, setFilterdate] =
		useState<[DateValue, DateValue]>(defFilterdate);

	const handleChange = (filterdate: [DateValue, DateValue]) => {
		setDefFilterdate(filterdate);
		if (filterdate[0] && filterdate[1]) {
			setFilterdate(filterdate);
		}
	};

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
		const filterdate: [DateValue, DateValue] = [
			dayjs().day(-28).format("YYYY-MM-DD"),
			dayjs().format("YYYY-MM-DD"),
		];
		setFilterdate(filterdate);
		setDefFilterdate(filterdate);
	};

	return (
		<Paper>
			<Template.Title>Жупнал инцидентов</Template.Title>
			<Group justify="flex-end">
				<DatePickerInput
					type="range"
					value={defFilterdate}
					onChange={handleChange}
				/>
			</Group>
			<Tabs defaultValue="detail" mt="xs">
				<Tabs.List>
					<Tabs.Tab value="detail">Кратко</Tabs.Tab>
					<Tabs.Tab value="generate">Детально</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="detail">
					<IncidentDetail filterdate={filterdate} />
				</Tabs.Panel>
				<Tabs.Panel value="short">
					<IncidentShort filterdate={filterdate} />
				</Tabs.Panel>
				<Tabs.Panel value="generate">
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
